const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const bcrypt = require("bcrypt");
const { authenticate, requireRoles } = require("../middleware/authorization");

/**
 * =========================
 * GET /users
 * Hanya admin yang bisa melihat semua data users.
 * =========================
 */
router.get("/", authenticate, requireRoles("Admin"), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, username, email, role, created_at, updated_at 
       FROM users 
       ORDER BY 
         CASE role 
           WHEN 'Admin' THEN 1
           WHEN 'Kasir' THEN 2  
           WHEN 'Customer' THEN 3
           ELSE 4
         END ASC, 
         id ASC`
    );

    res.json({
      message: "Data users berhasil diambil.",
      users: rows,
      total: rows.length,
    });
  } catch (err) {
    console.error("Error di /users:", err);
    res.status(500).json({ message: "Gagal mengambil data users." });
  }
});

/**
 * =========================
 * GET /profile
 * Hanya user login bisa lihat profil dirinya sendiri.
 * =========================
 */
router.get("/profile", authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, username, email, role FROM users WHERE id = $1",
      [req.user.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Profil tidak ditemukan." });

    res.json({
      message: "Profil berhasil diambil.",
      profile: rows[0],
    });
  } catch (err) {
    console.error("Error di /profile:", err);
    res.status(500).json({ message: "Gagal mengambil profil." });
  }
});

/**
 * =========================
 * POST /register
 * Hanya admin yang bisa menambah user baru.
 * =========================
 */
router.post("/register", authenticate, requireRoles("Admin"), async (req, res) => {
  const { name, username, email, password, role } = req.body;

  try {
    // Cek apakah username atau email sudah terdaftar
    const exists = await pool.query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (exists.rows.length > 0)
      return res.status(400).json({ message: "Username atau email sudah digunakan." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    const { rows } = await pool.query(
      `INSERT INTO users (name, username, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, username, email, role`,
      [name, username, email, hashedPassword, role || "Kasir"]
    );

    res.status(201).json({
      message: "User baru berhasil dibuat.",
      user: rows[0],
    });
  } catch (err) {
    console.error("Error di /register:", err);
    res.status(500).json({ message: "Gagal membuat user baru." });
  }
});

router.put("/deactivate-user", authenticate, requireRoles("Admin"), async (req, res) => {
  const { id } = req.body;

  if (!id) return res.status(400).json({ message: "ID user wajib dikirim di body." });

  try {
    // Cek role user
    const userCheck = await pool.query(
      "SELECT role FROM users WHERE id = $1",
      [id]
    );

    if (userCheck.rows.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan." });

    // Tidak boleh nonaktifkan Admin
    if (userCheck.rows[0].role === 'Admin') {
      return res.status(403).json({
        message: "Tidak bisa menonaktifkan user dengan role Admin."
      });
    }

    // Nonaktifkan
    await pool.query(
      "UPDATE users SET is_active = FALSE, role = $1 WHERE id = $2",
      ["Inactive", id]
    );

    res.json({ message: `User dengan ID ${id} berhasil dinonaktifkan.` });

  } catch (err) {
    console.error("Error di /deactivate-user:", err);
    res.status(500).json({ message: "Gagal menonaktifkan user." });
  }
});

/**
 * =========================
 * PUT /activate-user
 * Mengaktifkan user (mengubah role dari Inactive ke role lainnya)
 * =========================
 */
router.put("/activate-user", authenticate, requireRoles("Admin"), async (req, res) => {
  const { id, role } = req.body;

  if (!id)
    return res.status(400).json({ message: "ID user wajib dikirim di body." });

  // Role baru wajib diberikan (misalnya Kasir, Admin)
  if (!role)
    return res.status(400).json({ message: "Role baru wajib diberikan." });

  try {
    const { rowCount } = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2",
      [role, id]
    );

    if (!rowCount)
      return res.status(404).json({ message: "User tidak ditemukan." });

    res.json({ message: `User dengan ID ${id} berhasil diaktifkan sebagai ${role}.` });
  } catch (err) {
    console.error("Error di /activate-user:", err);
    res.status(500).json({ message: "Gagal mengaktifkan user." });
  }
});

module.exports = router;