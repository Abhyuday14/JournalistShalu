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

-- Initial Seed Data (Optional)
-- INSERT INTO users (username, email, password_hash, role) VALUES ('admin', 'shalu@example.com', 'admin123', 'admin');
-- INSERT INTO profile (user_id, bio_short, professional_title, contact_email, contact_phone) VALUES (1, 'Journalist covering social issues and environment.', 'Investigative Journalist', 'shalusachdeva1920@gmail.com', '+91 9982644844');
-- INSERT INTO settings (key, value) VALUES ('site_title', 'Shalu Sachdeva'), ('site_tagline', 'Journalism with Purpose');
