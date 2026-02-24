/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoint untuk manajemen dan profil user
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Ambil semua daftar user (hanya Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar user berhasil diambil
 *         content:
 *           application/json:
 *             example:
 *               message: "Daftar user berhasil diambil."
 *               users:
 *                 - id: 1
 *                   name: "Admin Utama"
 *                   username: "admin"
 *                   email: "admin@example.com"
 *                   role: "Admin"
 *                   created_at: "2024-01-15T10:30:00.000Z"
 *                 - id: 2
 *                   name: "Kasir 1"
 *                   username: "kasir1"
 *                   email: "kasir1@example.com"
 *                   role: "Kasir"
 *                   created_at: "2024-01-14T08:15:00.000Z"
 *                 - id: 3
 *                   name: "User Nonaktif"
 *                   username: "inactiveuser"
 *                   email: "inactive@example.com"
 *                   role: "Inactive"
 *                   created_at: "2024-01-13T14:20:00.000Z"
 *               total: 3
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       403:
 *         description: Akses ditolak, hanya admin yang bisa mengakses
 *       500:
 *         description: Gagal mengambil daftar user
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Ambil profil user yang sedang login
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil user berhasil diambil
 *         content:
 *           application/json:
 *             example:
 *               message: "Profil berhasil diambil."
 *               profile:
 *                 id: 1
 *                 name: "John Doe"
 *                 username: "johndoe"
 *                 email: "john@example.com"
 *                 role: "Kasir"
 *       401:
 *         description: Token tidak ditemukan atau tidak valid
 *       404:
 *         description: Profil tidak ditemukan
 *       500:
 *         description: Gagal mengambil profil
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Tambah user baru (hanya Admin)
 *     tags: [Users]
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
 *               - username
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               username:
 *                 type: string
 *                 example: "janedoe"
 *               email:
 *                 type: string
 *                 example: "jane@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               role:
 *                 type: string
 *                 example: "Kasir"
 *     responses:
 *       201:
 *         description: User baru berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               message: "User baru berhasil dibuat."
 *               user:
 *                 id: 2
 *                 name: "Jane Doe"
 *                 username: "janedoe"
 *                 email: "jane@example.com"
 *                 role: "Kasir"
 *       400:
 *         description: Username atau email sudah digunakan
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Hanya admin yang bisa melakukan ini
 *       500:
 *         description: Gagal membuat user baru
 */

/**
 * @swagger
 * /users/deactivate-user:
 *   put:
 *     summary: Nonaktifkan user berdasarkan ID (hanya Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: User berhasil dinonaktifkan
 *         content:
 *           application/json:
 *             example:
 *               message: "User dengan ID 3 berhasil dinonaktifkan."
 *       400:
 *         description: ID user wajib dikirim di body
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Hanya admin yang bisa melakukan ini
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Gagal menonaktifkan user
 */
/**
 * @swagger
 * /users/activate-user:
 *   put:
 *     summary: Aktifkan kembali user berdasarkan ID (hanya Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - role
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *               role:
 *                 type: string
 *                 example: "Kasir"
 *                 description: Role baru user setelah diaktifkan (misalnya Kasir, Admin)
 *     responses:
 *       200:
 *         description: User berhasil diaktifkan kembali
 *         content:
 *           application/json:
 *             example:
 *               message: "User dengan ID 3 berhasil diaktifkan sebagai Kasir."
 *       400:
 *         description: ID atau role wajib dikirim di body
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Hanya admin yang bisa melakukan ini
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Gagal mengaktifkan user
 */

