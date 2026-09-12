// js/services/supabase.js

const SUPABASE_URL = 'https://almsaxabtcvvbavryfkz.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tjkWshNulAKnWZNV5MxnKA_Dj2ezBdV';

// Memastikan library window.supabase dari CDN sudah siap
if (!window.supabase || !window.supabase.createClient) {
    console.error('Supabase SDK belum dimuat via CDN di index.html');
}

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY
);
