// ========================== IMPORT ===============================
const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Middleware autentikasi sederhana
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token tidak ditemukan" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token tidak valid" });
    req.user = user;
    next();
  });
};

// ========================== LOGIN ===============================
// Endpoint: POST /auth/login
// Login user dan hasilkan token JWT (access & refresh)

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("🔐 Login attempt for username:", username);

    // 1. Cari user di database
    const userResult = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (userResult.rows.length === 0) {
      console.log("❌ User not found:", username);
      return res.status(404).json({ 
        success: false,
        message: "User tidak ditemukan" 
      });
    }

    const user = userResult.rows[0];
    console.log("✅ User found:", user.username, "Role:", user.role);

    // 2. FILTER ANTI LOGIN UNTUK AKUN NONAKTIF
    if (user.role === "Inactive") {
      console.log("⛔ Account inactive:", username);
      return res.status(403).json({
        success: false,
        message: "Akun Anda telah dinonaktifkan. Silakan hubungi admin.",
      });
    }

    // 3. DEBUG: Tampilkan password dari DB
    console.log("🔑 Password from DB:", user.password.substring(0, 20) + "...");
    console.log("🔑 Password input:", password);

    // 4. Compare password (pastikan pakai bcrypt)
    let validPassword;
    try {
      validPassword = await bcrypt.compare(password, user.password);
      console.log("🔐 Password comparison result:", validPassword);
    } catch (bcryptError) {
      console.error("❌ bcrypt.compare error:", bcryptError);
      // Fallback: jika bcrypt error, coba compare langsung untuk debugging
      validPassword = (password === user.password); // Hanya untuk development!
      console.log("🔄 Fallback comparison result:", validPassword);
    }

    if (!validPassword) {
      console.log("❌ Invalid password for user:", username);
      return res.status(401).json({ 
        success: false,
        message: "Password salah" 
      });
    }

    // 5. Buat JWT tokens
    const accessToken = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role,
        name: user.name 
      },
      process.env.ACCESS_TOKEN_SECRET || "dev-secret-key-123", // Fallback untuk dev
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret-456",
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful for:", user.username);
    console.log("🎫 Access token generated");

    // 6. Response SESUAI FORMAT YANG FRONTEND HARAPKAN
    res.status(200).json({
      success: true,  // Frontend cari ini
      message: `Login berhasil! Selamat datang, ${user.name}.`,
      token: accessToken,  // Frontend cari properti "token" (bukan "accessToken")
      accessToken: accessToken, // Tetap kasih juga
      refreshToken: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      },
      accessTokenExpiresIn: "1 jam",
      refreshTokenExpiresIn: "7 hari"
    });

  } catch (error) {
    console.error("🔥 Error di /auth/login:", error);
    
    // Error detail untuk debugging
    res.status(500).json({ 
      success: false,
      message: "Terjadi kesalahan server",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;