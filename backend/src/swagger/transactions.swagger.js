/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API untuk manajemen transaksi (Admin & Kasir)
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Ambil semua transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar transaksi
 *         content:
 *           application/json:
 *             example:
 *               transactions:
 *                 - id: 1
 *                   sale_date: "2025-11-25T16:18:29.337Z"
 *                   total_amount: 250000
 *                   discount: 0
 *                   paid: 250000
 *                   status: "Paid"
 *                   cashier_name: "Dina"
 *                   customer_name: "Rudi"
 *                   created_at: "2025-11-25T16:18:29.337Z"
 *                   updated_at: "2025-11-25T16:18:29.337Z"
 *
 *   post:
 *     summary: Buat transaksi baru
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cashier_id
 *               - customer_id
 *               - total_amount
 *               - paid
 *             properties:
 *               cashier_id:
 *                 type: integer
 *                 example: 2
 *               customer_id:
 *                 type: integer
 *                 example: 5
 *               total_amount:
 *                 type: number
 *                 example: 250000
 *               discount:
 *                 type: number
 *                 example: 5000
 *               paid:
 *                 type: number
 *                 example: 245000
 *           example:
 *             cashier_id: 2
 *             customer_id: 5
 *             total_amount: 250000
 *             discount: 5000
 *             paid: 245000
 *     responses:
 *       201:
 *         description: Transaksi dibuat
 *         content:
 *           application/json:
 *             example:
 *               message: "Transaksi dibuat"
 *               id: 12
 */

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Ambil detail transaksi berdasarkan ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail transaksi ditemukan
 *         content:
 *           application/json:
 *             example:
 *               transaction:
 *                 id: 1
 *                 sale_date: "2025-11-25T16:18:29.337Z"
 *                 cashier_id: 3
 *                 customer_id: 5
 *                 total_amount: 250000
 *                 discount: 0
 *                 paid: 250000
 *                 status: "Paid"
 *                 created_at: "2025-11-25T16:18:29.337Z"
 *                 updated_at: "2025-11-25T16:18:29.337Z"
 *       404:
 *         description: Transaksi tidak ditemukan
 *       403:
 *         description: Akses ditolak (customer mencoba akses transaksi orang lain)
 *
 *   put:
 *     summary: Update status transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Paid, Pending]
 *                 example: "Paid"
 *               paid:
 *                 type: number
 *                 example: 200000
 *           example:
 *             status: "Paid"
 *             paid: 200000
 *     responses:
 *       200:
 *         description: Transaksi diupdate
 *         content:
 *           application/json:
 *             example:
 *               message: "Transaksi diupdate."
 *       404:
 *         description: Transaksi tidak ditemukan
 *
 *   delete:
 *     summary: Hapus transaksi
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaksi berhasil dihapus
 *         content:
 *           application/json:
 *             example:
 *               message: "Transaksi berhasil dihapus."
 *       404:
 *         description: Transaksi tidak ditemukan
 */