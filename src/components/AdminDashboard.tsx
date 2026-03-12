import React from 'react';
import { FileText, ArrowRight, User } from 'lucide-react';
import { Article } from '../types';

const AdminDashboard = ({ articles }: { articles: Article[] }) => {
  const stats = [
    { label: 'Total Articles', value: articles.length, icon: FileText, color: 'bg-blue-500' },
    { label: 'Published', value: articles.filter(a => a.status === 'published').length, icon: ArrowRight, color: 'bg-green-500' },
    { label: 'Drafts', value: articles.filter(a => a.status === 'draft').length, icon: FileText, color: 'bg-yellow-500' },
    { label: 'Total Views', value: articles.reduce((acc, curr) => acc + curr.views_count, 0), icon: User, color: 'bg-purple-500' },
  ];

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-sage-green/20 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.color} text-white rounded-xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-sage-green/20 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-sage-green/10 flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold">Recent Articles</h2>
          <a href="#admin-articles" className="text-nature-green font-bold text-sm">View All</a>
        </div>
        <div className="overflow-x-auto">
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
              {articles.slice(0, 5).map((article) => (
                <tr key={article.id} className="hover:bg-off-white transition-colors">
                  <td className="px-6 py-4 font-medium">{article.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-deep-charcoal/60">{new Date(article.publication_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <a href="#admin-articles" className="text-nature-green hover:underline font-bold text-sm">Manage</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
