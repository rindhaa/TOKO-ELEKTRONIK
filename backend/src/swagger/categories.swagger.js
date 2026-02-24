/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Endpoint untuk manajemen kategori produk (only for Admin)
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Ambil semua kategori
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar kategori
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Elektronik
 *                       description:
 *                         type: string
 *                         example: Barang-barang elektronik
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       403:
 *         description: Akses ditolak (bukan Admin)
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Ambil detail satu kategori berdasarkan ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID kategori
 *     responses:
 *       200:
 *         description: Detail kategori ditemukan
 *       404:
 *         description: Kategori tidak ditemukan
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Tambah kategori baru
 *     tags: [Categories]
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
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 example: Elektronik
 *               description:
 *                 type: string
 *                 example: Barang-barang elektronik
 *     responses:
 *       201:
 *         description: Kategori berhasil dibuat
 *       400:
 *         description: Input tidak valid
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Ubah data kategori
 *     tags: [Categories]
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
 *               name:
 *                 type: string
 *                 example: Komputer & Laptop
 *               description:
 *                 type: string
 *                 example: Semua jenis komputer dan laptop
 *     responses:
 *       200:
 *         description: Kategori berhasil diupdate
 *       404:
 *         description: Kategori tidak ditemukan
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Hapus kategori berdasarkan ID
 *     tags: [Categories]
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
 *         description: Kategori berhasil dihapus
 *       404:
 *         description: Kategori tidak ditemukan
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 */
