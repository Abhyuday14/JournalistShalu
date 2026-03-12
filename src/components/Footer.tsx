import React from 'react';
import { Twitter, Linkedin, Instagram, Mail, Github } from 'lucide-react';
import { Profile } from '../types';

const Footer = ({ profile }: { profile: Profile | null }) => {
  let socialLinks: any = {};
  try {
    socialLinks = JSON.parse(profile?.social_links || '{}');
  } catch (e) {}

  return (
    <footer className="bg-nature-green text-off-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-serif font-bold mb-4">{profile?.professional_title || 'Shalu Sachdeva'}</h3>
          <p className="text-sage-green/80 max-w-xs">
            {profile?.bio_short || 'Investigative journalist dedicated to uncovering stories that matter.'}
          </p>
        </div>
        <div>
          <h4 className="font-serif text-xl mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sage-green/80">
            <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-xl mb-4">Connect</h4>
          <div className="flex space-x-4 mb-6">
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Twitter size={20} /></a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Linkedin size={20} /></a>
            )}
            {socialLinks.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Instagram size={20} /></a>
            )}
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Github size={20} /></a>
            )}
            {profile?.contact_email && (
              <a href={`mailto:${profile.contact_email}`} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Mail size={20} /></a>
            )}
            {Object.keys(socialLinks).length === 0 && !profile?.contact_email && (
              <p className="text-sage-green/80 text-sm">No social links added yet.</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/10 text-center text-sage-green/60 text-sm">
        &copy; {new Date().getFullYear()} {profile?.professional_title || 'Shalu Sachdeva'}. All rights reserved.
      </div>
    </div>
  </footer>
  );
};

export default Footer;
