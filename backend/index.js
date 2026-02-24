require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;


// ✅ import semua route dari folder src/routes
const authRoutes = require('./src/routes/auth');
const categoriesRoutes = require('./src/routes/categories');
const productsRoutes = require('./src/routes/products');
const transactionsRoutes = require('./src/routes/transactions');
const usersRoutes = require('./src/routes/users');

console.log({
  authRoutes,
  categoriesRoutes,
  productsRoutes,
  transactionsRoutes,
  usersRoutes
});

// ✅ import Swagger (konfigurasi dipisah di src/swagger/swagger.js)
const { swaggerUi, swaggerSpec } = require('./src/swagger/swagger');

// ✅ middleware dasar
app.use(cors());
app.use(express.json());

// ✅ pasang Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// ✅ pasang semua route utama
app.use('/auth', authRoutes);
app.use('/categories', categoriesRoutes);
app.use('/products', productsRoutes);
app.use('/transactions', transactionsRoutes);
app.use('/users', usersRoutes);

// ✅ health check endpoint
app.get('/', (req, res) => res.json({ message: 'API Toko Elektronik berjalan' }));

// ✅ jalankan server
app.listen(port, () => {
  console.log(`✅ Server jalan di http://localhost:${port}`);
  console.log(`📘 Swagger Docs: http://localhost:${port}/api-docs`);
});
