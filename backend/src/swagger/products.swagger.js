/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API untuk manajemen produk
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Ambil semua produk
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua produk
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Laptop Asus"
 *                       category_name:
 *                         type: string
 *                         example: "Elektronik"
 *                       description:
 *                         type: string
 *                         example: "Laptop gaming"
 *                       price:
 *                         type: number
 *                         example: 15000000
 *                       stock:
 *                         type: integer
 *                         example: 10
 *                       is_available:
 *                         type: boolean
 *                         example: true
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00.000Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00.000Z"
 *             example:
 *               products:
 *                 - id: 1
 *                   name: "Laptop Asus"
 *                   category_name: "Elektronik"
 *                   description: "Laptop gaming"
 *                   price: 15000000
 *                   stock: 10
 *                   is_available: true
 *                   created_at: "2023-01-01T00:00:00.000Z"
 *                   updated_at: "2023-01-01T00:00:00.000Z"
 *                 - id: 2
 *                   name: "Smartphone Samsung"
 *                   category_name: "Elektronik"
 *                   description: "HP flagship"
 *                   price: 12000000
 *                   stock: 15
 *                   is_available: true
 *                   created_at: "2023-01-01T00:00:00.000Z"
 *                   updated_at: "2023-01-01T00:00:00.000Z"
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       500:
 *         description: Gagal mengambil produk
 *
 *   post:
 *     summary: Tambah produk baru
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Smartphone Samsung"
 *               description:
 *                 type: string
 *                 example: "HP flagship"
 *               price:
 *                 type: number
 *                 example: 12000000
 *               stock:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       201:
 *         description: Produk berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               message: "Produk ditambahkan"
 *               product:
 *                 id: 5
 *                 name: "Smartphone Samsung"
 *                 category_name: "Elektronik"
 *                 description: "HP flagship"
 *                 price: 12000000
 *                 stock: 15
 *                 is_available: true
 *                 created_at: "2023-01-01T00:00:00.000Z"
 *                 updated_at: "2023-01-01T00:00:00.000Z"
 *       401:
 *         description: Tidak diizinkan - hanya Admin
 *       500:
 *         description: Gagal menambah produk
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Ambil produk berdasarkan ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Detail produk berdasarkan ID
 *         content:
 *           application/json:
 *             example:
 *               product:
 *                 id: 1
 *                 name: "Laptop Asus"
 *                 category_name: "Elektronik"
 *                 description: "Laptop gaming"
 *                 price: 15000000
 *                 stock: 10
 *                 is_available: true
 *                 created_at: "2023-01-01T00:00:00.000Z"
 *                 updated_at: "2023-01-01T00:00:00.000Z"
 *       404:
 *         description: Produk tidak ditemukan
 *       401:
 *         description: Tidak diizinkan - hanya Admin dan Kasir
 *       500:
 *         description: Gagal mengambil produk berdasarkan ID
 *
 *   put:
 *     summary: Update produk berdasarkan ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               description:
 *                 type: string
 *                 example: "Laptop gaming terbaik"
 *               price:
 *                 type: number
 *                 example: 16000000
 *               stock:
 *                 type: integer
 *                 example: 8
 *               is_available:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Produk berhasil diupdate
 *         content:
 *           application/json:
 *             example:
 *               message: "Produk berhasil diupdate."
 *               product:
 *                 id: 1
 *                 name: "Laptop Asus"
 *                 category_name: "Elektronik"
 *                 description: "Laptop gaming terbaik"
 *                 price: 16000000
 *                 stock: 8
 *                 is_available: true
 *                 created_at: "2023-01-01T00:00:00.000Z"
 *                 updated_at: "2023-01-02T00:00:00.000Z"
 *       404:
 *         description: Produk tidak ditemukan
 *       401:
 *         description: Tidak diizinkan - hanya Admin
 *       500:
 *         description: Gagal update produk
 *
 *   delete:
 *     summary: Hapus produk berdasarkan ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *         content:
 *           application/json:
 *             example:
 *               message: "Produk berhasil dihapus."
 *       404:
 *         description: Produk tidak ditemukan
 *       401:
 *         description: Tidak diizinkan - hanya Admin
 *       500:
 *         description: Gagal hapus produk
 */