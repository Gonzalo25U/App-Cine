
// supabaseClient.js
const SUPABASE_URL = 'https://wkiurfpzjwtrmmsuapnb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndraXVyZnB6and0cm1tc3VhcG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MTU2MTcsImV4cCI6MjA2NjQ5MTYxN30.cKGHEQrAp8Z-u7GBZoARBZxR1NyepZD4mKJ-Fa-W2Yk';  

// Inicializa el cliente y lo guarda en window.supabase
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

