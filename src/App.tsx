import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Menu, X, Github, Twitter, Linkedin, Instagram, 
  ArrowRight, Mail, Phone, MapPin, Search, 
  ChevronRight, Calendar, User, ExternalLink,
  LayoutDashboard, FileText, Image as ImageIcon, Settings as SettingsIcon, LogOut
} from 'lucide-react';
import { Article, Profile, Category, Settings } from './types';

// --- Components ---

const Navbar = ({ isAdmin = false, onLogout }: { isAdmin?: boolean, onLogout?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = isAdmin ? [
    { name: 'Dashboard', href: '#admin-dashboard', icon: LayoutDashboard },
    { name: 'Articles', href: '#admin-articles', icon: FileText },
    { name: 'Media', href: '#admin-media', icon: ImageIcon },
    { name: 'Settings', href: '#admin-settings', icon: SettingsIcon },
  ] : [
    { name: 'Home', href: '#home' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'frosted-glass py-3 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-serif font-bold text-nature-green tracking-tight">
              SHALU <span className="text-sage-green">SACHDEVA</span>
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-deep-charcoal hover:text-nature-green font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  {link.icon && <link.icon size={18} />}
                  {link.name}
                </a>
              ))}
              {isAdmin && (
                <button onClick={onLogout} className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2">
                  <LogOut size={18} /> Logout
                </button>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-nature-green">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden frosted-glass absolute w-full"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-deep-charcoal hover:text-nature-green font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            {isAdmin && (
              <button onClick={onLogout} className="w-full text-left px-3 py-2 text-red-600 font-medium">
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-nature-green text-off-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-serif font-bold mb-4">Shalu Sachdeva</h3>
          <p className="text-sage-green/80 max-w-xs">
            Investigative journalist dedicated to uncovering stories that matter.
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
            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Twitter size={20} /></a>
            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><Mail size={20} /></a>
          </div>
          <a href="#admin-dashboard" className="text-sage-green/40 hover:text-white text-xs uppercase tracking-widest font-bold flex items-center gap-2">
            <User size={14} /> Admin Login
          </a>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-white/10 text-center text-sage-green/60 text-sm">
        &copy; {new Date().getFullYear()} Shalu Sachdeva. All rights reserved.
      </div>
    </div>
  </footer>
);

// --- Pages ---

const HomePage = ({ articles, profile }: { articles: Article[], profile: Profile | null }) => {
  const featuredArticles = articles.slice(0, 3);
  const latestArticles = articles.slice(3, 9);

  return (
    <div id="home">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
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
              <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight mb-6">
                Stories that <span className="text-sage-green italic">Breathe</span>
              </h1>
              <p className="text-xl text-deep-charcoal/80 mb-8 max-w-lg leading-relaxed">
                {profile?.bio_short || "Investigative journalist uncovering the intersections of environment, society, and human resilience."}
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
                <img 
                  src="https://picsum.photos/seed/journalist/800/800" 
                  alt="Shalu Sachdeva" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
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
                  <img 
                    src={article.featured_image || `https://picsum.photos/seed/${article.id}/800/600`} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
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
                  <img 
                    src={article.featured_image || `https://picsum.photos/seed/${article.id}/200/200`} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
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
                <img 
                  src={article.featured_image || `https://picsum.photos/seed/${article.id}/800/600`} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
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

const AboutPage = ({ profile }: { profile: Profile | null }) => (
  <div id="about" className="pt-32 pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          <div className="relative">
            <div className="rounded-3xl overflow-hidden border-8 border-white shadow-2xl">
              <img 
                src="https://picsum.photos/seed/about/800/1000" 
                alt="Shalu Sachdeva" 
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
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
          <div className="mt-12">
            <a href="#" className="px-8 py-4 nature-gradient text-white rounded-full font-medium inline-flex items-center gap-2 hover:shadow-lg transition-all">
              Download CV <ExternalLink size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);

const ContactPage = ({ profile }: { profile: Profile | null }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-5xl font-serif font-bold mb-6">Let's Connect</h2>
            <p className="text-xl text-deep-charcoal/60 mb-12">
              Have a story tip, a collaboration proposal, or just want to say hello? I'd love to hear from you.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-sage-green/10 rounded-2xl flex items-center justify-center text-nature-green">
                  <Mail size={28} />
                </div>
                <div>
                  <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest">Email</p>
                  <p className="text-xl font-medium">{profile?.contact_email || 'hello@shalusachdeva.com'}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-sage-green/10 rounded-2xl flex items-center justify-center text-nature-green">
                  <Phone size={28} />
                </div>
                <div>
                  <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest">Phone</p>
                  <p className="text-xl font-medium">{profile?.contact_phone || '+1 (555) 123-4567'}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-sage-green/10 rounded-2xl flex items-center justify-center text-nature-green">
                  <MapPin size={28} />
                </div>
                <div>
                  <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest">Location</p>
                  <p className="text-xl font-medium">New Delhi, India / Global</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-off-white p-10 rounded-3xl border border-sage-green/20 shadow-sm">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-nature-green text-white rounded-full flex items-center justify-center mx-auto mb-6">
                  <ArrowRight size={40} className="rotate-[-45deg]" />
                </div>
                <h3 className="text-3xl font-serif font-bold mb-4">Message Sent!</h3>
                <p className="text-deep-charcoal/60">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                <button onClick={() => setStatus('idle')} className="mt-8 text-nature-green font-bold">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Name</label>
                    <input name="name" type="text" required className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Email</label>
                    <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Subject</label>
                  <input name="subject" type="text" required className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Message</label>
                  <textarea name="message" rows={5} required className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'sending'}
                  className="w-full py-4 nature-gradient text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
                {status === 'error' && <p className="text-red-600 text-center">Something went wrong. Please try again.</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticleDetailPage = ({ slug, articles }: { slug: string, articles: Article[] }) => {
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
            <img 
              src={article.featured_image || `https://picsum.photos/seed/${article.id}/1200/800`} 
              alt={article.title} 
              className="w-full h-auto"
              referrerPolicy="no-referrer"
            />
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
              <img src="https://picsum.photos/seed/journalist/200/200" alt="Shalu Sachdeva" referrerPolicy="no-referrer" />
            </div>
            <div>
              <p className="text-sm text-deep-charcoal/40 font-bold uppercase tracking-widest">Written By</p>
              <p className="text-xl font-serif font-bold">Shalu Sachdeva</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- Admin Panel ---

const AdminLogin = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) onLogin(data.user);
      else setError(data.message);
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-off-white p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-sage-green/20"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-nature-green">Admin Access</h1>
          <p className="text-deep-charcoal/60">Manage your portfolio content</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
            />
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full py-4 nature-gradient text-white rounded-xl font-bold hover:shadow-lg transition-all">
            Login
          </button>
        </form>
      </motion.div>
    </div>
  );
};

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
                    <button className="text-nature-green hover:underline font-bold text-sm">Edit</button>
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

const AdminArticles = ({ articles }: { articles: Article[] }) => (
  <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-serif font-bold">Manage Articles</h1>
      <button className="px-6 py-2 nature-gradient text-white rounded-full font-bold">New Article</button>
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
                  <button className="text-nature-green hover:underline font-bold text-sm">Edit</button>
                  <button className="text-red-600 hover:underline font-bold text-sm">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const AdminMedia = () => (
  <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-serif font-bold">Media Library</h1>
      <button className="px-6 py-2 nature-gradient text-white rounded-full font-bold">Upload Media</button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="aspect-square rounded-xl overflow-hidden border border-sage-green/20 group relative">
          <img src={`https://picsum.photos/seed/${i}/400/400`} alt="Media" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="text-white font-bold text-xs uppercase tracking-widest">Delete</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AdminSettings = ({ profile, settings, onUpdate }: { profile: Profile | null, settings: Settings | null, onUpdate: () => void }) => {
  const [profData, setProfData] = useState(profile || { bio_short: '', bio_long: '', professional_title: '', contact_email: '', contact_phone: '', social_links: '{}' });
  const [settData, setSettData] = useState(settings || { site_title: '', site_tagline: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setProfData(profile);
  }, [profile]);

  useEffect(() => {
    if (settings) setSettData(settings);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profData),
        }),
        fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settData),
        })
      ]);
      onUpdate();
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings');
    }
    setSaving(false);
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
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
                  value={profData.contact_email}
                  onChange={(e) => setProfData({ ...profData, contact_email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-sage-green/30 focus:outline-none focus:ring-2 focus:ring-nature-green/20" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-deep-charcoal/60 mb-2 uppercase tracking-widest">Contact Phone</label>
                <input 
                  type="text" 
                  value={profData.contact_phone}
                  onChange={(e) => setProfData({ ...profData, contact_phone: e.target.value })}
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

// --- Main App ---

export default function App() {
  const [view, setView] = useState<string>('home');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [user, setUser] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [artRes, catRes, profRes, setRes] = await Promise.all([
        fetch('/api/articles'),
        fetch('/api/categories'),
        fetch('/api/profile'),
        fetch('/api/settings')
      ]);
      setArticles(await artRes.json());
      setCategories(await catRes.json());
      setProfile(await profRes.json());
      setSettings(await setRes.json());
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    fetchData();

    // Simple hash-based routing + path-based fallback
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const path = window.location.pathname.replace('/', '');
      
      if (hash) {
        setView(hash);
      } else if (path && path.startsWith('admin')) {
        setView(path);
      } else {
        setView('home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    handleHashChange();
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const isAdminView = view.startsWith('admin');

  if (isAdminView && !user) {
    return <AdminLogin onLogin={setUser} />;
  }

  const renderView = () => {
    if (view.startsWith('article/')) {
      const slug = view.split('/')[1];
      return <ArticleDetailPage slug={slug} articles={articles} />;
    }

    switch (view) {
      case 'home': return <HomePage articles={articles} profile={profile} />;
      case 'portfolio': return <PortfolioPage articles={articles} categories={categories} />;
      case 'about': return <AboutPage profile={profile} />;
      case 'contact': return <ContactPage profile={profile} />;
      case 'admin-dashboard': return <AdminDashboard articles={articles} />;
      case 'admin-articles': return <AdminArticles articles={articles} />;
      case 'admin-media': return <AdminMedia />;
      case 'admin-settings': return <AdminSettings profile={profile} settings={settings} onUpdate={fetchData} />;
      default: return <HomePage articles={articles} profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isAdmin={isAdminView} 
        onLogout={() => { setUser(null); window.location.hash = 'home'; }} 
      />
      <main className="flex-grow">
        {renderView()}
      </main>
      {!isAdminView && <Footer />}
    </div>
  );
}
