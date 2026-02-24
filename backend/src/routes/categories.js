const express = require('express');
const router = express.Router();
const db = require('../db/pool');
const { authenticate, requireRoles } = require('../middleware/authorization');


//GET /categories
//Hanya Admin yang bisa melihat semua kategori.
router.get('/', authenticate, requireRoles('Admin'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY id');
    res.json({ categories: rows });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil kategori.' });
  }
});


//GET /categories/:id
//Ambil detail satu kategori berdasarkan id.
router.get('/:id', authenticate, requireRoles('Admin'), async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    res.json({ category: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil kategori.' });
  }
});


//POST /categories/Only for Admin
router.post('/', authenticate, requireRoles('Admin'), async (req, res) => {
  const { name, description } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO categories(name, description) VALUES($1,$2) RETURNING *',
      [name, description]
    );
    res.status(201).json({ message: 'Kategori baru berhasil dibuat ✅', category: rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Gagal membuat kategori baru ❌' });
  }
});


//PUT /categories/:id/Only for Admin
router.put('/:id', authenticate, requireRoles('Admin'), async (req, res) => {
  const { name, description } = req.body;
  try {
    const { rowCount } = await db.query(
      'UPDATE categories SET name=$1, description=$2, updated_at=NOW() WHERE id=$3',
      [name, description, req.params.id]
    );
    if (!rowCount) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    res.json({ message: 'Kategori diupdate.' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update kategori.' });
  }
});


//DELETE /categories/:id/Admin bisa hapus kategori.
router.delete('/:id', authenticate, requireRoles('Admin'), async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM categories WHERE id=$1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    res.json({ message: 'Kategori dihapus.' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal hapus kategori.' });
  }
});

module.exports = router;
