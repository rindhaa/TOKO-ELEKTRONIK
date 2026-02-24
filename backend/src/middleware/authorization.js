// import jsonwebtoken untuk verifikasi token
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware: authenticate
 * Memverifikasi JWT dari header Authorization.
 * Jika valid → simpan payload ke req.user, agar bisa diakses route berikutnya.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization']; // ambil header Authorization
  const token = authHeader && authHeader.split(' ')[1]; // format: Bearer <token>
  if (!token) return res.status(401).json({ message: 'Token tidak ditemukan.' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa.' });
    req.user = payload; // simpan data user ke request
    next();
  });
}

/**
 * Middleware: requireRoles(...allowedRoles)
 * Mengecek apakah role user termasuk dalam daftar role yang diizinkan.
 * Contoh: requireRoles('Admin', 'Kasir')
 */
function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return res.status(403).json({ message: 'Role tidak ditemukan.' });

    const normalized = role.toLowerCase(); // bikin lowercase agar tidak sensitif
    const allowed = allowedRoles.map(r => r.toLowerCase());
    if (!allowed.includes(normalized)) {
      return res.status(403).json({ message: 'Akses ditolak: role tidak diizinkan.' });
    }
    next();
  };
}

module.exports = { authenticate, requireRoles };
