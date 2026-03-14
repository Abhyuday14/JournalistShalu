import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Article, Profile } from '../types';
import { SignedImage } from './SignedImage';

const HomePage = ({ articles, profile }: { articles: Article[], profile: Profile | null }) => {
  const featuredArticles = articles.slice(0, 3);
  const latestArticles = articles.slice(3, 9);

  return (
    <div id="home">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-16 lg:pt-0 lg:pb-0 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/nature/1920/1080" 
            alt="Nature Background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-off-white/50 via-transparent to-off-white"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight mb-6">
                Stories that <span className="text-sage-green italic">Breathe</span>
              </h1>
              <p className="text-xl text-deep-charcoal/80 mb-8 max-w-lg leading-relaxed">
                {profile?.bio_short || "Political Journalist uncovering the intersections of environment, society, and human resilience."}
              </p>
              <div className="flex gap-4">
                <a href="#portfolio" className="px-8 py-4 nature-gradient text-white rounded-full font-medium flex items-center gap-2 hover:shadow-lg transition-all">
                  View My Work <ArrowRight size={20} />
                </a>
                <a href="#contact" className="px-8 py-4 border-2 border-nature-green text-nature-green rounded-full font-medium hover:bg-nature-green hover:text-white transition-all">
                  Get in Touch
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="w-80 h-80 md:w-[500px] md:h-[500px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] overflow-hidden border-8 border-white shadow-2xl mx-auto">
                {profile?.profile_photo ? (
                  <SignedImage src={profile.profile_photo} alt="Shalu Sachdeva" className="w-full h-full object-cover" />
                ) : (
                  <img 
                    src="https://picsum.photos/seed/journalist/800/800" 
                    alt="Shalu Sachdeva" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-sage-green/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-nature-green/10 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-4">Featured Work</h2>
              <p className="text-deep-charcoal/60">In-depth investigations and impactful stories.</p>
            </div>
            <a href="#portfolio" className="text-nature-green font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View All <ChevronRight size={20} />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="organic-card group"
              >
                <div className="h-64 overflow-hidden rounded-t-2xl">
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
                  <div className="flex items-center gap-2 text-xs text-sage-green font-bold uppercase tracking-wider mb-3">
                    <span>{article.categories || 'Uncategorized'}</span>
                    <span className="w-1 h-1 bg-sage-green rounded-full"></span>
                    <span>{new Date(article.publication_date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-sage-green transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-deep-charcoal/70 line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <a href={`#article/${article.slug}`} className="inline-flex items-center gap-2 text-nature-green font-bold group-hover:gap-3 transition-all">
                    Read Article <ArrowRight size={18} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-24 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold mb-12 text-center">Latest Publications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <div key={article.id} className="flex gap-4 items-start p-4 hover:bg-white rounded-xl transition-colors">
                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                  {article.featured_image ? (
                    <SignedImage src={article.featured_image} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <img 
                      src={`https://picsum.photos/seed/${article.id}/200/200`} 
                      alt={article.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div>
                  <span className="text-xs text-sage-green font-bold uppercase">{new Date(article.publication_date).toLocaleDateString()}</span>
                  <h4 className="font-serif font-bold text-lg leading-tight mt-1 mb-2 hover:text-nature-green cursor-pointer">
                    {article.title}
                  </h4>
                  <a href={`#article/${article.slug}`} className="text-sm text-nature-green font-medium flex items-center gap-1">
                    Read More <ChevronRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
