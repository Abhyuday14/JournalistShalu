import React, { useState, useEffect } from 'react';
import { Article, Profile, Category, Settings } from './types';
import { supabase } from './supabaseClient';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import PortfolioPage from './components/PortfolioPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import ArticleDetailPage from './components/ArticleDetailPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminArticles from './components/AdminArticles';
import AdminMedia from './components/AdminMedia';
import AdminSettings from './components/AdminSettings';

export default function App() {
  const [view, setView] = useState<string>('home');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchData = async () => {
    try {
      // 1. Fetch Articles
      const { data: articlesData, error: artError } = await supabase
        .from('articles')
        .select(`
          *,
          categories:article_categories(
            category:categories(name)
          )
        `)
        .order('publication_date', { ascending: false });
      
      if (artError) throw artError;

      // Format categories array for frontend
      const formattedArticles = (articlesData || []).map(art => ({
        ...art,
        categories: art.categories?.map((c: any) => c.category?.name).join(",") || ""
      }));
      setArticles(formattedArticles);

      // 2. Fetch Categories
      const { data: catData } = await supabase.from('categories').select('*');
      setCategories(catData || []);

      // 3. Fetch Profile
      const { data: profData } = await supabase.from('profile').select('*').limit(1).maybeSingle();
      setProfile(profData || null);

      // 4. Fetch Settings
      const { data: setData } = await supabase.from('settings').select('*');
      const settingsObj = (setData || []).reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      setSettings(settingsObj);
      
    } catch (err) {
      console.error('Failed to fetch data from Supabase', err);
    }
  };

  useEffect(() => {
    fetchData();

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Simple hash-based routing + path-based fallback
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const path = window.location.pathname.replace('/', '');
      
      if (hash) {
        setView(hash);
      } else if (path && (path.startsWith('admin') || path === 'login')) {
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
      subscription.unsubscribe();
    };
  }, []);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center text-nature-green font-medium">Loading...</div>;
  }

  const isAdminView = view.startsWith('admin');

  if (isAdminView && !user) {
    window.location.hash = 'login';
    return null;
  }

  if (view === 'login') {
    if (user) {
      window.location.hash = 'admin-dashboard';
      return null;
    }
    return <AdminLogin onLogin={setUser} />;
  }

  const renderView = () => {
    if (view.startsWith('article/')) {
      const slug = view.split('/')[1];
      return <ArticleDetailPage slug={slug} articles={articles} profile={profile} />;
    }

    switch (view) {
      case 'home': return <HomePage articles={articles} profile={profile} />;
      case 'portfolio': return <PortfolioPage articles={articles} categories={categories} />;
      case 'about': return <AboutPage profile={profile} settings={settings} />;
      case 'contact': return <ContactPage profile={profile} settings={settings} />;
      case 'admin-dashboard': return <AdminDashboard articles={articles} />;
      case 'admin-articles': return <AdminArticles articles={articles} onRefresh={fetchData} user={user} />;
      case 'admin-media': return <AdminMedia user={user} />;
      case 'admin-settings': return <AdminSettings profile={profile} settings={settings} onUpdate={fetchData} user={user} />;
      default: return <HomePage articles={articles} profile={profile} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isAdmin={isAdminView} 
        onLogout={async () => { 
          await supabase.auth.signOut();
          setUser(null); 
          window.location.href = '/'; 
        }} 
      />
      <main className="flex-grow">
        {renderView()}
      </main>
      {!isAdminView && <Footer profile={profile} settings={settings} />}
    </div>
  );
}
