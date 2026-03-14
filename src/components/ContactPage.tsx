import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Profile, Settings } from '../types';

const ContactPage = ({ profile, settings }: { profile: Profile | null, settings: Settings | null }) => {
  return (
    <div id="contact" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-5xl font-serif font-bold mb-6">Let's Connect</h2>
        <p className="text-xl text-deep-charcoal/60 mb-16 max-w-2xl mx-auto">
          Have a story tip, a collaboration proposal, or just want to say hello? I'd love to hear from you.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-8 bg-off-white rounded-3xl border border-sage-green/20 shadow-sm">
            <div className="w-16 h-16 bg-sage-green/10 rounded-2xl flex items-center justify-center text-nature-green mb-6">
              <Mail size={32} />
            </div>
            <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest mb-2">Email</p>
            <p className="text-lg font-medium">{settings?.contact_email !== undefined ? settings.contact_email : 'hello@shalusachdeva.com'}</p>
          </div>
          
          <div className="flex flex-col items-center p-8 bg-off-white rounded-3xl border border-sage-green/20 shadow-sm">
            <div className="w-16 h-16 bg-sage-green/10 rounded-2xl flex items-center justify-center text-nature-green mb-6">
              <Phone size={32} />
            </div>
            <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest mb-2">Phone</p>
            <p className="text-lg font-medium">{settings?.contact_phone !== undefined ? settings.contact_phone : '+1 (555) 123-4567'}</p>
          </div>
          
          <div className="flex flex-col items-center p-8 bg-off-white rounded-3xl border border-sage-green/20 shadow-sm">
            <div className="w-16 h-16 bg-sage-green/10 rounded-2xl flex items-center justify-center text-nature-green mb-6">
              <MapPin size={32} />
            </div>
            <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest mb-2">Location</p>
            <p className="text-lg font-medium text-center">{settings?.contact_address !== undefined ? settings.contact_address : 'New Delhi, India / Global'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
