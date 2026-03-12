import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Profile } from '../types';
import { supabase } from '../supabaseClient';

const ContactPage = ({ profile }: { profile: Profile | null }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const { error } = await supabase.from('contact_submissions').insert([
        { 
          name: data.name, 
          email: data.email, 
          subject: data.subject, 
          message: data.message 
        }
      ]);
      if (error) throw error;
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-5xl font-serif font-bold mb-6">Let's Connect</h2>
            <p className="text-xl text-deep-charcoal/60 mb-12">
              Have a story tip, a collaboration proposal, or just want to say hello? I'd love to hear from you.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-sage-green/10 rounded-2xl flex items-center justify-center text-nature-green">
                  <Mail size={28} />
                </div>
                <div>
                  <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest">Email</p>
                  <p className="text-xl font-medium">{profile?.contact_email || 'hello@shalusachdeva.com'}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-sage-green/10 rounded-2xl flex items-center justify-center text-nature-green">
                  <Phone size={28} />
                </div>
                <div>
                  <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest">Phone</p>
                  <p className="text-xl font-medium">{profile?.contact_phone || '+1 (555) 123-4567'}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-sage-green/10 rounded-2xl flex items-center justify-center text-nature-green">
                  <MapPin size={28} />
                </div>
                <div>
                  <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest">Location</p>
                  <p className="text-xl font-medium">{profile?.contact_address || 'New Delhi, India / Global'}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-off-white p-10 rounded-3xl border border-sage-green/20 shadow-sm">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-nature-green text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <ArrowRight size={40} className="rotate-[-45deg]" />
                </div>
                <h3 className="text-3xl font-serif font-bold mb-4">Message Sent!</h3>
                <p className="text-deep-charcoal/60">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                <button onClick={() => setStatus('idle')} className="mt-8 text-nature-green font-bold">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Name</label>
                    <input name="name" type="text" required className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Email</label>
                    <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Subject</label>
                  <input name="subject" type="text" required className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Message</label>
                  <textarea name="message" rows={5} required className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'sending'}
                  className="w-full py-4 nature-gradient text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'error' && <p className="text-red-600 text-center">Something went wrong. Please try again.</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
