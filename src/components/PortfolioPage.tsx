import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import { Article, Category } from '../types';
import { SignedImage } from './SignedImage';

const PortfolioPage = ({ articles, categories }: { articles: Article[], categories: Category[] }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredArticles = articles.filter(a => {
    const matchesCategory = filter === 'all' || a.categories?.includes(filter);
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="portfolio" className="pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold mb-4">Portfolio</h1>
          <p className="text-deep-charcoal/60 max-w-2xl mx-auto">
            A comprehensive collection of my journalistic work, ranging from environmental investigations to human interest features.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${filter === 'all' ? 'nature-gradient text-white shadow-md' : 'bg-white text-deep-charcoal hover:bg-sage-green/10'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setFilter(cat.name)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${filter === cat.name ? 'nature-gradient text-white shadow-md' : 'bg-white text-deep-charcoal hover:bg-sage-green/10'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-deep-charcoal/40" size={20} />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-sage-green/30 bg-white focus:outline-none focus:ring-2 focus:ring-nature-green/20"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <motion.div
              layout
              key={article.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="organic-card group"
            >
              <div className="h-56 overflow-hidden rounded-t-2xl">
                {article.featured_image ? (
                  <SignedImage src={article.featured_image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <img 
                    src={`https://picsum.photos/seed/${article.id}/800/600`} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-sage-green font-bold uppercase tracking-wider mb-2">
                  <span>{article.categories || 'Uncategorized'}</span>
                </div>
                <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-nature-green transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-deep-charcoal/70 line-clamp-2 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-deep-charcoal/40 flex items-center gap-1">
                    <Calendar size={14} /> {new Date(article.publication_date).toLocaleDateString()}
                  </span>
                  <a href={`#article/${article.slug}`} className="text-nature-green font-bold text-sm flex items-center gap-1">
                    Read <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredArticles.length === 0 && (
          <div className="text-center py-24">
            <p className="text-xl text-deep-charcoal/40">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
