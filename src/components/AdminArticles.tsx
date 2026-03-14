import React, { useState } from 'react';
import { Article } from '../types';
import { supabase } from '../supabaseClient';
import { SignedImage } from './SignedImage';

const AdminArticles = ({ articles, onRefresh, user }: { articles: Article[], onRefresh: () => void, user: any }) => {
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<number | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreateNew = () => {
    setEditingArticle({
      id: 0,
      title: '',
      subtitle: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: '',
      status: 'draft',
      publication_date: new Date().toISOString(),
      external_link: '',
      author_id: 1,
      views_count: 0,
    });
  };

  const confirmDelete = async () => {
    if (articleToDelete === null) return;
    try {
      const article = articles.find(a => a.id === articleToDelete);
      const { error } = await supabase.from('articles').delete().eq('id', articleToDelete);
      if (error) throw error;
      
      if (article?.featured_image && !article.featured_image.startsWith('http')) {
        await supabase.storage.from('app-files').remove([article.featured_image]);
      }

      if (editingArticle?.id === articleToDelete) {
        setEditingArticle(null);
      }
      
      onRefresh();
      showNotification('Article deleted successfully', 'success');
    } catch (err: any) {
      showNotification(`Error deleting article: ${err.message}`, 'error');
    }
    setArticleToDelete(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user || !editingArticle) return;
    setSaving(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${user.id}/articles/${editingArticle.id || 'new'}/${fileName}`;

    const { error } = await supabase.storage.from('app-files').upload(filePath, file);
    if (error) {
      showNotification(`Upload failed: ${error.message}`, 'error');
    } else {
      setEditingArticle({ ...editingArticle, featured_image: filePath });
      showNotification('Image uploaded successfully', 'success');
    }
    setSaving(false);
  };

  const handleDelete = (id: number) => {
    setArticleToDelete(id);
  };

  const handleSaveEdit = async () => {
    if (!editingArticle) return;
    setSaving(true);
    try {
      const articleData = {
        title: editingArticle.title,
        subtitle: editingArticle.subtitle,
        slug: editingArticle.slug,
        content: editingArticle.content,
        excerpt: editingArticle.excerpt,
        featured_image: editingArticle.featured_image,
        status: editingArticle.status,
        publication_date: editingArticle.publication_date,
        external_link: editingArticle.external_link,
      };

      if (editingArticle.id === 0) {
        const { error } = await supabase.from('articles').insert([articleData]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', editingArticle.id);
        if (error) throw error;
      }

      setEditingArticle(null);
      onRefresh();
      showNotification('Article saved successfully!', 'success');
    } catch (err: any) {
      showNotification(`Error saving article: ${err.message}`, 'error');
    }
    setSaving(false);
  };

  if (editingArticle) {
    return (
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative">
        {notification && (
          <div className={`fixed top-24 right-8 p-4 rounded-xl shadow-lg z-50 text-white font-bold ${notification.type === 'success' ? 'bg-nature-green' : 'bg-red-500'}`}>
            {notification.message}
          </div>
        )}
        {articleToDelete !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-3xl max-w-md w-full mx-4 shadow-xl">
              <h3 className="text-2xl font-serif font-bold mb-4">Confirm Deletion</h3>
              <p className="text-deep-charcoal/60 mb-8">Are you sure you want to delete this article? This action cannot be undone.</p>
              <div className="flex gap-4 justify-end">
                <button onClick={() => setArticleToDelete(null)} className="px-6 py-2 border border-sage-green/30 text-deep-charcoal rounded-full font-bold">Cancel</button>
                <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700">Delete</button>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold">{editingArticle.id === 0 ? 'Create Article' : 'Edit Article'}</h1>
          <div className="flex gap-4">
            {editingArticle.id !== 0 && (
              <button 
                onClick={() => handleDelete(editingArticle.id)} 
                className="px-6 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-full font-bold"
              >
                Delete
              </button>
            )}
            <button onClick={() => setEditingArticle(null)} className="px-6 py-2 border border-sage-green/30 text-deep-charcoal rounded-full font-bold">Cancel</button>
            <button onClick={handleSaveEdit} disabled={saving} className="px-6 py-2 nature-gradient text-white rounded-full font-bold disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
        <div className="space-y-6 bg-white p-8 rounded-3xl border border-sage-green/20 shadow-sm">
          <div>
            <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Title</label>
            <input 
              type="text" 
              value={editingArticle.title}
              onChange={(e) => {
                const newTitle = e.target.value;
                if (editingArticle.id === 0) {
                  const newSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  setEditingArticle({...editingArticle, title: newTitle, slug: newSlug});
                } else {
                  setEditingArticle({...editingArticle, title: newTitle});
                }
              }}
              className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Subtitle</label>
            <input 
              type="text" 
              value={editingArticle.subtitle || ''}
              onChange={(e) => setEditingArticle({...editingArticle, subtitle: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Slug</label>
              <input 
                type="text" 
                value={editingArticle.slug}
                onChange={(e) => setEditingArticle({...editingArticle, slug: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Status</label>
              <select 
                value={editingArticle.status}
                onChange={(e) => setEditingArticle({...editingArticle, status: e.target.value as 'draft' | 'published'})}
                className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Excerpt</label>
            <textarea 
              rows={3}
              value={editingArticle.excerpt || ''}
              onChange={(e) => setEditingArticle({...editingArticle, excerpt: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Content (Markdown/HTML)</label>
            <textarea 
              rows={12}
              value={editingArticle.content || ''}
              onChange={(e) => setEditingArticle({...editingArticle, content: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20 font-mono text-sm" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Featured Image</label>
            <div className="flex items-center gap-4">
              {editingArticle.featured_image && (
                <SignedImage src={editingArticle.featured_image} className="w-16 h-16 rounded-xl object-cover" />
              )}
              <input 
                type="text" 
                value={editingArticle.featured_image || ''}
                onChange={(e) => setEditingArticle({...editingArticle, featured_image: e.target.value})}
                className="flex-1 px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
                placeholder="URL or upload file..."
              />
              <label className="px-4 py-3 bg-sage-green/10 text-nature-green rounded-xl font-bold cursor-pointer hover:bg-sage-green/20">
                Upload
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">External Link (Optional)</label>
            <input 
              type="text" 
              value={editingArticle.external_link || ''}
              onChange={(e) => setEditingArticle({...editingArticle, external_link: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {notification && (
        <div className={`fixed top-24 right-8 p-4 rounded-xl shadow-lg z-50 text-white font-bold ${notification.type === 'success' ? 'bg-nature-green' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
      {articleToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-3xl max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-2xl font-serif font-bold mb-4">Confirm Deletion</h3>
            <p className="text-deep-charcoal/60 mb-8">Are you sure you want to delete this article? This action cannot be undone.</p>
            <div className="flex gap-4 justify-end">
              <button onClick={() => setArticleToDelete(null)} className="px-6 py-2 border border-sage-green/30 text-deep-charcoal rounded-full font-bold">Cancel</button>
              <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold">Manage Articles</h1>
        <button onClick={handleCreateNew} className="px-6 py-2 nature-gradient text-white rounded-full font-bold">New Article</button>
      </div>
      <div className="bg-white rounded-2xl border border-sage-green/20 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-off-white text-xs text-deep-charcoal/40 font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-green/10">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-off-white transition-colors">
                <td className="px-6 py-4 font-medium">{article.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-deep-charcoal/60">{new Date(article.publication_date).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button onClick={() => setEditingArticle(article)} className="text-nature-green hover:underline font-bold text-sm">Edit</button>
                    <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:underline font-bold text-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminArticles;
