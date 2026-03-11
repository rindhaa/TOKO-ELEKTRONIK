const bcrypt = require('bcrypt');
const pool = require('../db/pool');

async function testAllPasswords() {
  try {
    // Ambil semua user
    const users = await pool.query("SELECT id, username, password FROM users");
    
    console.log("🔍 TEST PASSWORD UNTUK SEMUA USER\n");
    
    for (const user of users.rows) {
      // Coba compare dengan password yang kita tahu (misal dari database aslinya)
      // GANTI PASSWORD INI SESUAI YANG ADA DI INSERT AWAL
      let originalPassword;
      
      // Mapping username ke password asli (sesuai file db Anda)
      switch(user.username) {
        case 'rndsv_':
          originalPassword = 'sempolayam';
          break;
        case 'titistsabith_':
          originalPassword = 'tahugoreng';
          break;
        case 'nov_kasir':
          originalPassword = 'pulung04';
          break;
        case 'munggut_kasir':
          originalPassword = 'ngrandu03';
          break;
        case 'sc_cst':
          originalPassword = 'custom89';
          break;
        case 'sct_cs':
          originalPassword = 'customm000';
          break;
        case 'bagas_cust':
          originalPassword = 'cust123';
          break;
        case 'yusuf_cust':
          originalPassword = 'cust789';
          break;
        case 'citra_cust':
          originalPassword = 'cust000';
          break;
        case 'intan_cust':
          originalPassword = 'cust456';
          break;
        default:
          originalPassword = 'unknown';
      }
      
      console.log(`🧪 Testing: ${user.username}`);
      console.log(`   Password di DB: ${user.password.substring(0, 20)}...`);
      
      // Test compare
      const isValid = await bcrypt.compare(originalPassword, user.password);
      console.log(`   Hasil compare: ${isValid ? '✅ BERHASIL' : '❌ GAGAL'}`);
      
      // Test juga dengan input kosong (untuk debug)
      const testEmpty = await bcrypt.compare('', user.password);
      console.log(`   Test dengan password kosong: ${testEmpty ? '❌???' : '✅ (OK)'}`);
      
      console.log('---');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error);
    process.exit(1);
  }
}

testAllPasswords();