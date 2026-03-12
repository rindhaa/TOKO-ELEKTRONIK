// src/db/pool.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // WAJIB untuk koneksi ke Supabase
  }
});

// helper simple untuk query
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};