-- Run this in your Supabase SQL Editor

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles Table
CREATE TABLE IF NOT EXISTS articles (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft',
  publication_date TIMESTAMPTZ,
  external_link TEXT,
  author_id BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views_count INTEGER DEFAULT 0
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT
);

-- Article Categories Junction
CREATE TABLE IF NOT EXISTS article_categories (
  article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

-- Profile Table
CREATE TABLE IF NOT EXISTS profile (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id BIGINT REFERENCES users(id),
  bio_short TEXT,
  bio_long TEXT,
  professional_title TEXT,
  profile_photo TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  social_links JSONB DEFAULT '{}'::jsonb
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'unread'
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- 1. Articles
-- Public can read published articles
CREATE POLICY "Public can view published articles" ON articles
  FOR SELECT USING (status = 'published');
-- Admin can do everything (insert, update, delete, read drafts)
CREATE POLICY "Admin can do all on articles" ON articles
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 2. Categories
-- Public can read categories
CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);
-- Admin can do everything
CREATE POLICY "Admin can do all on categories" ON categories
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 3. Profile
-- Public can read profile
CREATE POLICY "Public can view profile" ON profile
  FOR SELECT USING (true);
-- Admin can do everything
CREATE POLICY "Admin can do all on profile" ON profile
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 4. Settings
-- Public can read settings
CREATE POLICY "Public can view settings" ON settings
  FOR SELECT USING (true);
-- Admin can do everything
CREATE POLICY "Admin can do all on settings" ON settings
  FOR ALL USING (auth.uid() IS NOT NULL);

-- 5. Contact Submissions
-- Public can insert new contact submissions
CREATE POLICY "Public can insert contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);
-- Admin can read, update, delete submissions
CREATE POLICY "Admin can do all on contact submissions" ON contact_submissions
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Initial Seed Data (Optional)
-- INSERT INTO users (username, email, password_hash, role) VALUES ('admin', 'shalu@example.com', 'admin123', 'admin');
-- INSERT INTO profile (user_id, bio_short, professional_title, contact_email, contact_phone) VALUES (1, 'Journalist covering social issues and environment.', 'Political Journalist', 'shalusachdeva1920@gmail.com', '+91 9982644844');
-- INSERT INTO settings (key, value) VALUES ('site_title', 'Shalu Sachdeva'), ('site_tagline', 'Journalism with Purpose');
