import React, { useState, useEffect } from 'react';
import { Profile, Settings } from '../types';
import { supabase } from '../supabaseClient';
import { SignedImage } from './SignedImage';

const AdminSettings = ({ profile, settings, onUpdate, user }: { profile: Profile | null, settings: Settings | null, onUpdate: () => void, user: any }) => {
  const [profData, setProfData] = useState(profile || { bio_short: '', bio_long: '', professional_title: '', profile_photo: '' });
  const [settData, setSettData] = useState(settings || { site_title: '', site_tagline: '', contact_email: '', contact_phone: '', contact_address: '', social_links: '{}', cv_file: '' });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    if (profile) setProfData(profile);
  }, [profile]);

  useEffect(() => {
    if (settings) setSettData(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save Profile
      const { error: profError } = await supabase
        .from('profile')
        .update({
          bio_short: profData.bio_short,
          bio_long: profData.bio_long,
          professional_title: profData.professional_title,
          profile_photo: profData.profile_photo
        })
        .eq('id', 1);
      
      if (profError) throw profError;

      // Save Settings
      const settingsPromises = Object.entries(settData).map(([key, value]) => 
        supabase.from('settings').upsert({ key, value })
      );
      await Promise.all(settingsPromises);

      onUpdate();
      showNotification('Settings saved successfully!', 'success');
    } catch (err: any) {
      showNotification(`Failed to save settings: ${err.message}`, 'error');
    }
    setSaving(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    setSaving(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${user.id}/profile/${fileName}`;

    const { error } = await supabase.storage.from('app-files').upload(filePath, file);
    if (error) {
      showNotification(`Upload failed: ${error.message}`, 'error');
    } else {
      setProfData({ ...profData, profile_photo: filePath });
      showNotification('Photo uploaded successfully', 'success');
    }
    setSaving(false);
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    setSaving(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${user.id}/profile/${fileName}`;

    const { error } = await supabase.storage.from('app-files').upload(filePath, file);
    if (error) {
      showNotification(`CV Upload failed: ${error.message}`, 'error');
    } else {
      setSettData({ ...settData, cv_file: filePath });
      showNotification('CV uploaded successfully', 'success');
    }
    setSaving(false);
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
      {notification && (
        <div className={`fixed top-24 right-8 p-4 rounded-xl shadow-lg z-50 text-white font-bold ${notification.type === 'success' ? 'bg-nature-green' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
      <h1 className="text-4xl font-serif font-bold mb-8">Settings & Profile</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-sage-green/20 shadow-sm">
          <h2 className="text-2xl font-serif font-bold mb-6">Site Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Site Title</label>
              <input 
                type="text" 
                value={settData.site_title}
                onChange={(e) => setSettData({ ...settData, site_title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Site Tagline</label>
              <input 
                type="text" 
                value={settData.site_tagline}
                onChange={(e) => setSettData({ ...settData, site_tagline: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-sage-green/20 shadow-sm">
          <h2 className="text-2xl font-serif font-bold mb-6">Profile Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Profile Photo</label>
              <div className="flex items-center gap-4">
                {profData.profile_photo && (
                  <SignedImage src={profData.profile_photo} className="w-16 h-16 rounded-full object-cover" />
                )}
                <input 
                  type="text" 
                  value={profData.profile_photo || ''}
                  onChange={(e) => setProfData({ ...profData, profile_photo: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
                  placeholder="URL or upload file..."
                />
                <label className="px-4 py-3 bg-sage-green/10 text-nature-green rounded-xl font-bold cursor-pointer hover:bg-sage-green/20">
                  Upload
                  <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">CV / Resume File</label>
              <div className="flex items-center gap-4">
                <input 
                  type="text" 
                  value={settData.cv_file || ''}
                  onChange={(e) => setSettData({ ...settData, cv_file: e.target.value })}
                  className="flex-1 px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
                  placeholder="URL or upload PDF..."
                />
                <label className="px-4 py-3 bg-sage-green/10 text-nature-green rounded-xl font-bold cursor-pointer hover:bg-sage-green/20">
                  Upload PDF
                  <input type="file" className="hidden" onChange={handleCVUpload} accept=".pdf,.doc,.docx" />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Professional Title</label>
                <input 
                  type="text" 
                  value={profData.professional_title}
                  onChange={(e) => setProfData({ ...profData, professional_title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Contact Email</label>
                <input 
                  type="email" 
                  value={settData.contact_email || ''}
                  onChange={(e) => setSettData({ ...settData, contact_email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Contact Phone</label>
                <input 
                  type="text" 
                  value={settData.contact_phone || ''}
                  onChange={(e) => setSettData({ ...settData, contact_phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Contact Address</label>
                <input 
                  type="text" 
                  value={settData.contact_address || ''}
                  onChange={(e) => setSettData({ ...settData, contact_address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Short Bio</label>
              <textarea 
                rows={3}
                value={profData.bio_short}
                onChange={(e) => setProfData({ ...profData, bio_short: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Long Bio</label>
              <textarea 
                rows={6}
                value={profData.bio_long}
                onChange={(e) => setProfData({ ...profData, bio_long: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
              ></textarea>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-sage-green/20 shadow-sm">
          <h2 className="text-2xl font-serif font-bold mb-6">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['twitter', 'linkedin', 'instagram', 'github'].map((platform) => {
              let currentLinks = {};
              try {
                currentLinks = JSON.parse(settData.social_links || '{}');
              } catch (e) {}
              
              return (
                <div key={platform}>
                  <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest capitalize">{platform} URL</label>
                  <input 
                    type="url" 
                    value={currentLinks[platform as keyof typeof currentLinks] || ''}
                    onChange={(e) => {
                      const newLinks = { ...currentLinks, [platform]: e.target.value };
                      setSettData({ ...settData, social_links: JSON.stringify(newLinks) });
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
                    placeholder={`https://${platform}.com/...`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 nature-gradient text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
