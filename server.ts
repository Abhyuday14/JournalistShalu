import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("password_hash", password)
      .single();

    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });

  // Articles
  app.get("/api/articles", async (req, res) => {
    const { data: articles, error } = await supabase
      .from("articles")
      .select(`
        *,
        categories:article_categories(
          category:categories(name)
        )
      `)
      .order("publication_date", { ascending: false });

    if (error) return res.status(500).json(error);

    // Flatten categories for the frontend
    const formattedArticles = articles.map(art => ({
      ...art,
      categories: art.categories?.map((c: any) => c.category.name).join(",") || ""
    }));

    res.json(formattedArticles);
  });

  app.get("/api/articles/:slug", async (req, res) => {
    const { data: article, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", req.params.slug)
      .single();

    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    const { title, subtitle, slug, content, excerpt, featured_image, status, publication_date, external_link, author_id } = req.body;
    const { data, error } = await supabase
      .from("articles")
      .insert([{ title, subtitle, slug, content, excerpt, featured_image, status, publication_date, external_link, author_id }])
      .select()
      .single();

    if (error) return res.status(500).json(error);
    res.json(data);
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*");
    if (error) return res.status(500).json(error);
    res.json(categories);
  });

  // Profile
  app.get("/api/profile", async (req, res) => {
    const { data: profile, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", 1)
      .single();
    if (error && error.code !== 'PGRST116') return res.status(500).json(error);
    res.json(profile || {});
  });

  app.put("/api/profile", async (req, res) => {
    const { bio_short, bio_long, professional_title, contact_email, contact_phone, social_links } = req.body;
    const { data, error } = await supabase
      .from("profile")
      .upsert({ 
        id: 1, 
        bio_short, 
        bio_long, 
        professional_title, 
        contact_email, 
        contact_phone, 
        social_links: typeof social_links === 'string' ? JSON.parse(social_links) : social_links 
      })
      .select();
    if (error) return res.status(500).json(error);
    res.json({ success: true });
  });

  app.put("/api/settings", async (req, res) => {
    const settings = req.body; // { key: value, ... }
    const entries = Object.entries(settings).map(([key, value]) => ({ key, value }));
    const { error } = await supabase
      .from("settings")
      .upsert(entries);
    if (error) return res.status(500).json(error);
    res.json({ success: true });
  });

  // Contact
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;
    const { error } = await supabase
      .from("contact_submissions")
      .insert([{ name, email, subject, message }]);
    if (error) return res.status(500).json(error);
    res.json({ success: true });
  });

  // Settings
  app.get("/api/settings", async (req, res) => {
    const { data: settings, error } = await supabase
      .from("settings")
      .select("*");
    if (error) return res.status(500).json(error);
    
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    try {
      console.log("Starting Vite in middleware mode...");
      const vite = await createViteServer({
        root: process.cwd(),
        server: { middlewareMode: true },
        appType: "spa",
      });
      console.log("Vite server created successfully.");
      app.use(vite.middlewares);
    } catch (e) {
      console.error("Failed to start Vite server:", e);
    }
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
