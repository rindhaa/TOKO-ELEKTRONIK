/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoint untuk autentikasi user dan token
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user dan hasilkan token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             example:
 *               message: "Login berhasil! Selamat datang, admin123."
 *               user:
 *                 id: 1
 *                 name: "Admin"
 *                 username: "admin123"
 *                 email: "admin@gmail.com"
 *                 role: "admin"
 *               accessToken: "jwt-access-token"
 *               accessTokenExpiresIn: "1 jam"
 *               refreshToken: "jwt-refresh-token"
 *               refreshTokenExpiresIn: "7 hari"
 *       401:
 *         description: Password salah
 *       404:
 *         description: User tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Perbarui access token menggunakan refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "jwt-refresh-token"
 *     responses:
 *       200:
 *         description: Access token berhasil diperbarui
 *         content:
 *           application/json:
 *             example:
 *               message: "Access token berhasil diperbarui"
 *               accessToken: "jwt-access-token-baru"
 *               accessTokenExpiresIn: "1 jam"
 *       400:
 *         description: Refresh token diperlukan
 *       403:
 *         description: Refresh token tidak valid
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user (hapus token di sisi client)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout berhasil
 *         content:
 *           application/json:
 *             example:
 *               message: "Logout berhasil. Silakan hapus token di sisi client."
 */
/**
 * @swagger
 * /auth/delete/{id}:
 *   delete:
 *     summary: Hapus user berdasarkan ID
 *     description: Menghapus user dari database berdasarkan ID. Endpoint ini memerlukan autentikasi menggunakan JWT Access Token.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID user yang akan dihapus
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 *         content:
 *           application/json:
 *             example:
 *               message: User dengan ID 3 berhasil dihapus.
 *       401:
 *         description: Token tidak ditemukan
 *         content:
 *           application/json:
 *             example:
 *               message: Token tidak ditemukan
 *       403:
 *         description: Token tidak valid
 *         content:
 *           application/json:
 *             example:
 *               message: Token tidak valid
 *       404:
 *         description: User tidak ditemukan
 *         content:
 *           application/json:
 *             example:
 *               message: User tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             example:
 *               message: Terjadi kesalahan server
 */
