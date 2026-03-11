import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://eikdfvqyrecyduxupnix.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_PxGC-hd7nB_Yt4tLv_1uyw_0pOKX72s";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
