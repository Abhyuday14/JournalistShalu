import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { Profile, Settings } from '../types';
import { SignedImage } from './SignedImage';
import { supabase } from '../supabaseClient';

const AboutPage = ({ profile, settings }: { profile: Profile | null, settings: Settings | null }) => {
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCvUrl = async () => {
      if (settings?.cv_file) {
        if (settings.cv_file.startsWith('http')) {
          setCvUrl(settings.cv_file);
        } else {
          const { data, error } = await supabase.storage
            .from('app-files')
            .createSignedUrl(settings.cv_file, 3600);
          if (!error && data) {
            setCvUrl(data.signedUrl);
          } else {
            const { data: publicData } = supabase.storage.from('app-files').getPublicUrl(settings.cv_file);
            setCvUrl(publicData.publicUrl);
          }
        }
      }
    };
    fetchCvUrl();
  }, [settings?.cv_file]);

  return (
  <div id="about" className="pt-32 pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border-8 border-white shadow-2xl">
              {profile?.profile_photo ? (
                <SignedImage src={profile.profile_photo} alt="Shalu Sachdeva" className="w-full h-auto" />
              ) : (
                <img 
                  src="https://picsum.photos/seed/about/800/1000" 
                  alt="Shalu Sachdeva" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 bg-nature-green text-white p-8 rounded-2xl shadow-xl hidden md:block">
              <p className="text-3xl font-serif font-bold">10+</p>
              <p className="text-sm text-sage-green font-bold uppercase tracking-widest">Years Experience</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-5xl font-serif font-bold mb-6">About Shalu Sachdeva</h2>
          <div className="prose prose-lg text-deep-charcoal/80">
            <p className="mb-6 leading-relaxed">
              {profile?.bio_long || "I am a dedicated investigative journalist with a passion for environmental justice and human rights. Over the past decade, I have reported from some of the most remote corners of the world, bringing to light stories of resilience and systemic change."}
            </p>
            <p className="mb-6 leading-relaxed">
              My work has been featured in major international publications, where I strive to combine rigorous research with compelling storytelling. I believe that journalism has the power to bridge divides and inspire action.
            </p>
            <div className="grid grid-cols-2 gap-8 mt-12">
              <div>
                <h4 className="font-serif font-bold text-xl mb-2 text-nature-green">Expertise</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Environmental Reporting</li>
                  <li>• Social Justice</li>
                  <li>• Investigative Features</li>
                  <li>• Multimedia Storytelling</li>
                </ul>
              </div>
              <div>
                <h4 className="font-serif font-bold text-xl mb-2 text-nature-green">Recognition</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Press Freedom Award 2024</li>
                  <li>• Green Journalism Grant</li>
                  <li>• Excellence in Reporting</li>
                </ul>
              </div>
            </div>
          </div>
          {cvUrl && (
            <div className="mt-12">
              <a href={cvUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 nature-gradient text-white rounded-full font-medium inline-flex items-center gap-2 hover:shadow-lg transition-all">
                Download CV <ExternalLink size={20} />
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  </div>
  );
};

export default AboutPage;
