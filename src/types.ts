export interface Article {
  id: number;
  title: string;
  subtitle: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  status: 'draft' | 'published' | 'archived';
  publication_date: string;
  external_link?: string;
  author_id: number;
  views_count: number;
  categories?: string;
}

export interface Profile {
  id: number;
  user_id: number;
  bio_short: string;
  bio_long: string;
  professional_title: string;
  profile_photo: string;
  contact_email: string;
  contact_phone: string;
  social_links: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface Settings {
  site_title: string;
  site_tagline: string;
}
