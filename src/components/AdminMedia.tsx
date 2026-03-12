import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { SignedImage } from './SignedImage';

const AdminMedia = ({ user }: { user: any }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchMedia = async () => {
    if (!user) return;
    const { data, error } = await supabase.storage.from('app-files').list(`${user.id}/media`);
    if (data) {
      setFiles(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${user.id}/media/${fileName}`;

    const { error } = await supabase.storage.from('app-files').upload(filePath, file);
    if (!error) {
      fetchMedia();
      showNotification('Media uploaded successfully', 'success');
    } else {
      showNotification(`Upload failed: ${error.message}`, 'error');
    }
    setUploading(false);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    const { error } = await supabase.storage.from('app-files').remove([`${user.id}/media/${fileToDelete}`]);
    if (!error) {
      fetchMedia();
      showNotification('Media deleted successfully', 'success');
    } else {
      showNotification(`Delete failed: ${error.message}`, 'error');
    }
    setFileToDelete(null);
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {notification && (
        <div className={`fixed top-24 right-8 p-4 rounded-xl shadow-lg z-50 text-white font-bold ${notification.type === 'success' ? 'bg-nature-green' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
      
      {fileToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-2xl font-serif font-bold mb-4">Confirm Deletion</h3>
            <p className="text-deep-charcoal/60 mb-8">Are you sure you want to delete this media file? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button onClick={() => setFileToDelete(null)} className="px-6 py-2 border border-sage-green/30 text-deep-charcoal rounded-full font-bold">Cancel</button>
              <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold">Media Library</h1>
        <label className="px-6 py-2 nature-gradient text-white rounded-full font-bold cursor-pointer">
          {uploading ? 'Uploading...' : 'Upload Media'}
          <input type="file" className="hidden" onChange={handleUpload} accept="image/*" disabled={uploading} />
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map(file => (
          <div key={file.id} className="aspect-square rounded-xl overflow-hidden border border-sage-green/20 group relative bg-gray-100">
            <SignedImage src={`${user.id}/media/${file.name}`} alt={file.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => setFileToDelete(file.name)} className="text-white font-bold text-xs uppercase tracking-widest">Delete</button>
            </div>
          </div>
        ))}
        {files.length === 0 && !uploading && (
          <div className="col-span-full text-center py-12 text-gray-500">No media files found.</div>
        )}
      </div>
    </div>
  );
};

export default AdminMedia;
