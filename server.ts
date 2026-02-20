import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const db = new Database("portfolio.db");

// Initialize Database Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subtitle TEXT,
    slug TEXT UNIQUE,
    content TEXT,
    excerpt TEXT,
    featured_image TEXT,
    status TEXT DEFAULT 'draft',
    publication_date DATETIME,
    external_link TEXT,
    author_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    views_count INTEGER DEFAULT 0,
    FOREIGN KEY (author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    slug TEXT UNIQUE,
    description TEXT,
    color TEXT
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    slug TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS article_categories (
    article_id INTEGER,
    category_id INTEGER,
    PRIMARY KEY (article_id, category_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS article_tags (
    article_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (article_id, tag_id),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    url TEXT,
    type TEXT,
    alt_text TEXT,
    caption TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    bio_short TEXT,
    bio_long TEXT,
    professional_title TEXT,
    profile_photo TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    social_links TEXT, -- JSON string
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'unread'
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed default admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE username = ?").get("admin");
if (!adminExists) {
  db.prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)").run(
    "admin",
    "shalu@example.com",
    "admin123", // In a real app, this would be hashed
    "admin"
  );
  
  // Seed default profile
  db.prepare("INSERT INTO profile (user_id, bio_short, professional_title, contact_email, contact_phone) VALUES (?, ?, ?, ?, ?)").run(
    1,
    "Journalist covering social issues and environment.",
    "Investigative Journalist",
    "shalusachdeva1920@gmail.com",
    "+91 9982644844"
  );

  // Seed default settings
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("site_title", "Shalu Sachdeva");
  db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("site_tagline", "Journalism with Purpose");

  // Seed Categories
  const categories = [
    { name: 'Investigative', slug: 'investigative', color: '#2D5016' },
    { name: 'Environment', slug: 'environment', color: '#A4C3A2' },
    { name: 'Social Issues', slug: 'social-issues', color: '#8B7355' },
    { name: 'Features', slug: 'features', color: '#DAA520' }
  ];
  const insertCat = db.prepare("INSERT INTO categories (name, slug, color) VALUES (?, ?, ?)");
  categories.forEach(cat => insertCat.run(cat.name, cat.slug, cat.color));

  // Seed Articles
  const articles = [
    {
      title: "The Silent Crisis: Water Scarcity in Rural Communities",
      subtitle: "An in-depth look at the struggle for clean water in the heart of the country.",
      slug: "silent-crisis-water-scarcity",
      excerpt: "Across the rural landscape, communities are facing an unprecedented water crisis that threatens their way of life.",
      content: "Water is the lifeblood of any community, but for many in rural areas, it is becoming a luxury. In this investigation, we explore the systemic failures and environmental factors contributing to this growing crisis. From dried-up wells to contaminated sources, the stories of those affected are a stark reminder of our most basic needs being unmet.\n\nLocal farmers describe the heartbreak of watching their crops wither as the water table drops. Meanwhile, health officials warn of the long-term consequences of inadequate sanitation. The path forward requires both immediate intervention and long-term policy changes to ensure that every citizen has access to safe, clean water.",
      status: "published",
      publication_date: "2024-01-15",
      author_id: 1
    },
    {
      title: "Renewable Resilience: How Coastal Towns are Fighting Back",
      subtitle: "Coastal communities are turning to wind and solar to protect their futures.",
      slug: "renewable-resilience-coastal-towns",
      excerpt: "As sea levels rise, these towns are not just surviving; they are innovating with renewable energy.",
      content: "The ocean has always been both a provider and a threat to coastal towns. Today, as climate change accelerates, the threat is more pronounced than ever. However, a new wave of resilience is emerging. By embracing renewable energy, these communities are reducing their carbon footprint and building a more stable future.\n\nOffshore wind farms and community-led solar projects are providing more than just power; they are creating jobs and a sense of purpose. We spoke with community leaders who are spearheading these initiatives, proving that even in the face of daunting challenges, innovation can lead the way.",
      status: "published",
      publication_date: "2024-02-01",
      author_id: 1
    },
    {
      title: "Urban Greenery: The Mental Health Benefits of City Parks",
      subtitle: "Why green spaces are essential for the well-being of urban dwellers.",
      slug: "urban-greenery-mental-health",
      excerpt: "New research highlights the profound impact that accessible parks have on reducing stress and improving mood.",
      content: "In the concrete jungle, parks are more than just aesthetic additions; they are vital for mental health. Recent studies have shown that spending time in green spaces can significantly lower cortisol levels and improve overall well-being. This feature explores the importance of urban planning that prioritizes nature.\n\nFrom small community gardens to expansive city parks, these spaces provide a much-needed escape from the hustle and bustle of city life. We interviewed psychologists and urban planners about how we can make our cities more livable by integrating more nature into our daily environments.",
      status: "published",
      publication_date: "2024-02-10",
      author_id: 1
    }
  ];
  const insertArt = db.prepare(`
    INSERT INTO articles (title, subtitle, slug, excerpt, content, status, publication_date, author_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertArtCat = db.prepare("INSERT INTO article_categories (article_id, category_id) VALUES (?, ?)");
  
  articles.forEach((art, i) => {
    const result = insertArt.run(art.title, art.subtitle, art.slug, art.excerpt, art.content, art.status, art.publication_date, art.author_id);
    insertArtCat.run(result.lastInsertRowid, (i % 4) + 1);
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Auth (Mock for now)
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password_hash = ?").get(username, password);
    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Articles
  app.get("/api/articles", (req, res) => {
    const articles = db.prepare(`
      SELECT a.*, GROUP_CONCAT(c.name) as categories
      FROM articles a
      LEFT JOIN article_categories ac ON a.id = ac.article_id
      LEFT JOIN categories c ON ac.category_id = c.id
      GROUP BY a.id
      ORDER BY a.publication_date DESC
    `).all();
    res.json(articles);
  });

  app.get("/api/articles/:slug", (req, res) => {
    const article = db.prepare("SELECT * FROM articles WHERE slug = ?").get(req.params.slug);
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  });

  app.post("/api/articles", (req, res) => {
    const { title, subtitle, slug, content, excerpt, featured_image, status, publication_date, external_link, author_id } = req.body;
    const result = db.prepare(`
      INSERT INTO articles (title, subtitle, slug, content, excerpt, featured_image, status, publication_date, external_link, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, subtitle, slug, content, excerpt, featured_image, status, publication_date, external_link, author_id);
    res.json({ id: result.lastInsertRowid });
  });

  // Categories
  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  // Profile
  app.get("/api/profile", (req, res) => {
    const profile = db.prepare("SELECT * FROM profile WHERE id = 1").get();
    res.json(profile);
  });

  app.put("/api/profile", (req, res) => {
    const { bio_short, bio_long, professional_title, contact_email, contact_phone, social_links } = req.body;
    db.prepare(`
      UPDATE profile 
      SET bio_short = ?, bio_long = ?, professional_title = ?, contact_email = ?, contact_phone = ?, social_links = ?
      WHERE id = 1
    `).run(bio_short, bio_long, professional_title, contact_email, contact_phone, social_links);
    res.json({ success: true });
  });

  app.put("/api/settings", (req, res) => {
    const settings = req.body; // { key: value, ... }
    const updateStmt = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        updateStmt.run(key, value);
      }
    });
    transaction(settings);
    res.json({ success: true });
  });

  // Contact
  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;
    db.prepare("INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)").run(name, email, subject, message);
    res.json({ success: true });
  });

  // Settings
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings").all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
