const express = require('express');
const router = express.Router();
const db = require('../db/pool');
const { authenticate, requireRoles } = require('../middleware/authorization');


//GET /transactions
//Hanya Admin & Kasir bisa melihat semua transaksi.

router.get('/', authenticate, requireRoles('Admin', 'Kasir'), async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT t.*, u.name AS cashier_name, cu.name AS customer_name
      FROM transactions t
      LEFT JOIN users u ON t.cashier_id = u.id
      LEFT JOIN users cu ON t.customer_id = cu.id
      ORDER BY t.id DESC
    `);
    res.json({ transactions: rows });
  } catch {
    res.status(500).json({ message: 'Gagal mengambil transaksi.' });
  }
});


//GET /transactions/:id
//Customer hanya bisa lihat transaksi miliknya. 

router.get('/:id', authenticate, requireRoles('Admin', 'Kasir', 'Customer'), async (req, res) => {
  try {
    const tid = req.params.id;
    const { rows } = await db.query('SELECT * FROM transactions WHERE id=$1', [tid]);
    if (!rows[0]) return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });

    // validasi: customer hanya boleh lihat transaksinya sendiri
    if (req.user.role === 'Customer' && rows[0].customer_id !== req.user.id)
      return res.status(403).json({ message: 'Akses ditolak.' });

    res.json({
      transaction: rows[0]
      // ✅ items: details.rows DIHAPUS
    });
  } catch {
    res.status(500).json({ message: 'Error mengambil transaksi.' });
  }
});

//POST /transactions
//Membuat transaksi baru oleh Kasir/Admin.

router.post('/', authenticate, requireRoles('Kasir'), async (req, res) => {
  const client = await db.pool.connect();
  try {
    // ✅ MODIFIKASI: Tambah total_amount dan hapus items validation
    const { cashier_id, customer_id, total_amount, discount = 0, paid } = req.body;


    // ✅ VALIDASI 1: Cek apakah cashier_id adalah role Kasir
    const cashierCheck = await client.query('SELECT role FROM users WHERE id = $1', [cashier_id]);
    if (cashierCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Cashier tidak ditemukan.' });
    }
    if (cashierCheck.rows[0].role !== 'Kasir') {
      return res.status(400).json({
        message: 'Hanya user dengan role Kasir yang bisa dijadikan cashier.'
      });
    }

    // ✅ VALIDASI 2: Cek apakah customer_id adalah role Customer
    const customerCheck = await client.query('SELECT role FROM users WHERE id = $1', [customer_id]);
    if (customerCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Customer tidak ditemukan.' });
    }
    if (customerCheck.rows[0].role !== 'Customer') {
      return res.status(400).json({
        message: 'Hanya user dengan role Customer yang bisa dijadikan customer.'
      });
    }


    // ✅ GUNAKAN total_amount langsung dari request body
    const totalAfterDiscount = total_amount - discount;
    const status = paid >= totalAfterDiscount ? 'Paid' : 'Pending';

    await client.query('BEGIN');

    const { rows: txRows } = await client.query(
      `INSERT INTO transactions (cashier_id, customer_id, total_amount, discount, paid, status) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [cashier_id, customer_id, totalAfterDiscount, discount, paid, status]
    );
    const tx = txRows[0];

    await client.query('COMMIT');
    res.status(201).json({ message: 'Transaksi dibuat', id: tx.id });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('ERROR BUAT TRANSAKSI:', err);
    res.status(500).json({ message: 'Gagal membuat transaksi.', error: err.message });
  } finally {
    client.release();
  }
});


// PUT /transactions/:id
//Update status transaksi (Paid/Pending)

router.put('/:id', authenticate, requireRoles('Kasir'), async (req, res) => {
  try {
    const { status, paid } = req.body;
    const { rowCount } = await db.query(
      'UPDATE transactions SET status=$1, paid=$2, updated_at=NOW() WHERE id=$3',
      [status, paid, req.params.id]
    );
    if (!rowCount) return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    res.json({ message: 'Transaksi diupdate.' });
  } catch {
    res.status(500).json({ message: 'Gagal update transaksi.' });
  }
});


//DELETE /transactions/:id
//Hapus transaksi.

router.delete('/:id', authenticate, requireRoles('Kasir'), async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const { rows } = await client.query('SELECT id FROM transactions WHERE id=$1', [req.params.id]);
    if (!rows[0]) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
    }


    // Hapus transaksi utama
    await client.query('DELETE FROM transactions WHERE id=$1', [req.params.id]);

    await client.query('COMMIT');
    res.json({ message: 'Transaksi berhasil dihapus.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('ERROR DELETE TRANSAKSI:', err);
    res.status(500).json({ message: 'Gagal menghapus transaksi.', error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;