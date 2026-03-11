const bcrypt = require('bcrypt');
const pool = require('../db/pool'); // Sesuaikan path ke pool.js

async function hashAllPasswords() {
  try {
    console.log('🔍 Mencari user dengan password plain...');
    
    // Ambil semua user
    const users = await pool.query("SELECT id, username, password FROM users");
    
    let hashedCount = 0;
    
    for (const user of users.rows) {
      // Cek apakah password sudah di-hash (bcrypt hash biasanya mulai dengan $2)
      if (!user.password.startsWith('$2')) {
        console.log(`⚙️  Hashing password untuk: ${user.username}`);
        
        // Hash password dengan bcrypt
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        // Update ke database
        await pool.query(
          "UPDATE users SET password = $1 WHERE id = $2",
          [hashedPassword, user.id]
        );
        
        hashedCount++;
        console.log(`✅ User ${user.username} berhasil di-hash`);
      } else {
        console.log(`⏭️  User ${user.username} sudah ter-hash, skip`);
      }
    }
    
    console.log(`\n🎉 Selesai! ${hashedCount} password berhasil di-hash.`);
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

hashAllPasswords();