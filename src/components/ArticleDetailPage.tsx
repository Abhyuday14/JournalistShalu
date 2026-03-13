import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Article, Profile } from '../types';
import { SignedImage } from './SignedImage';

const ArticleDetailPage = ({ slug, articles, profile }: { slug: string, articles: Article[], profile: Profile | null }) => {
  const article = articles.find(a => a.slug === slug);
  
  if (!article) return <div className="pt-32 text-center">Article not found</div>;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <a href="#portfolio" className="inline-flex items-center gap-2 text-nature-green font-bold mb-8 hover:gap-3 transition-all">
            <ArrowRight size={20} className="rotate-180" /> Back to Portfolio
          </a>
          <div className="flex items-center gap-2 text-sm text-sage-green font-bold uppercase tracking-widest mb-4">
            <span>{article.categories || 'Uncategorized'}</span>
            <span className="w-1 h-1 bg-sage-green rounded-full"></span>
            <span>{new Date(article.publication_date).toLocaleDateString()}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-2xl text-deep-charcoal/60 font-serif italic mb-12">
            {article.subtitle}
          </p>
          
          <div className="rounded-3xl overflow-hidden mb-12 shadow-xl">
            {article.featured_image ? (
              <SignedImage src={article.featured_image} alt={article.title} className="w-full h-auto" />
            ) : (
              <img 
                src={`https://picsum.photos/seed/${article.id}/1200/800`} 
                alt={article.title} 
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          <div className="prose prose-lg max-w-none text-deep-charcoal/80 leading-relaxed">
            {article.content.split('\n').map((p, i) => (
              <p key={i} className="mb-6">{p}</p>
            ))}
          </div>

          {article.external_link && (
            <div className="mt-12 p-8 bg-sage-green/10 rounded-2xl border border-sage-green/20 flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-xl mb-1">Read on Original Source</h4>
                <p className="text-sm text-deep-charcoal/60">This article was originally published on an external platform.</p>
              </div>
              <a 
                href={article.external_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 nature-gradient text-white rounded-full font-bold flex items-center gap-2"
              >
                Visit Site <ExternalLink size={18} />
              </a>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-sage-green/20 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              {profile?.profile_photo ? (
                <SignedImage src={profile.profile_photo} alt={profile.professional_title || "Shalu Sachdeva"} className="w-full h-full object-cover" />
              ) : (
                <img src="https://picsum.photos/seed/journalist/200/200" alt="Shalu Sachdeva" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest">Written By</p>
              <p className="text-xl font-serif font-bold">{profile?.professional_title || 'Shalu Sachdeva'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
