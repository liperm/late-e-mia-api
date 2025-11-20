import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.DATABASE_HOST;
const SUPABASE_KEY = process.env.DATABASE_PASSWORD;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
