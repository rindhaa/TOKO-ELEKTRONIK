const express = require('express');
const router = express.Router();
const db = require('../db/pool');
const { authenticate, requireRoles } = require('../middleware/authorization');

/**
 * GET /products
 * Admin, Kasir, dan Customer bisa lihat semua produk.
 */
router.get('/', authenticate, requireRoles('Admin', 'Kasir', 'Customer'), async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        p.id,
        p.name,
        c.name AS category_name,  -- category_name di bawah name
        p.description,
        p.price,
        p.stock,
        p.is_available,
        p.created_at,
        p.updated_at
      FROM products p 
      LEFT JOIN categories c ON p.category_id=c.id 
      ORDER BY p.id
    `);
    
    // Manual ordering untuk pastikan urutan field
    const orderedProducts = rows.map(({ id, name, category_name, ...rest }) => ({
      id,
      name,
      category_name,
      ...rest
    }));
    
    res.json({ products: orderedProducts });
  } catch (error) {
    console.error('Error di GET /products:', error);
    res.status(500).json({ message: 'Gagal mengambil produk.' });
  }
});

/**
 * GET /products/:id
 * Admin dan Kasir bisa lihat produk berdasarkan ID produk.
 */
router.get('/:id', authenticate, requireRoles('Admin', 'Kasir'), async (req, res) => {
  try {
    const productId = req.params.id;
    
    const { rows } = await db.query(`
      SELECT 
        p.id,
        p.name,
        c.name AS category_name,  -- category_name di bawah name
        p.description,
        p.price,
        p.stock,
        p.is_available,
        p.created_at,
        p.updated_at
      FROM products p 
      LEFT JOIN categories c ON p.category_id=c.id 
      WHERE p.id = $1
    `, [productId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    // Manual ordering untuk single product
    const product = rows[0];
    const orderedProduct = {
      id: product.id,
      name: product.name,
      category_name: product.category_name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      is_available: product.is_available,
      created_at: product.created_at,
      updated_at: product.updated_at
    };

    res.json({ product: orderedProduct });
  } catch (error) {
    console.error('Error di GET /products/:id:', error);
    res.status(500).json({ message: 'Gagal mengambil produk berdasarkan ID.' });
  }
});

/**
 * POST /products
 * Admin menambahkan produk baru.
 */
router.post('/', authenticate, requireRoles('Admin'), async (req, res) => {
  const { categoryId, name, description, price, stock } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO products(category_id, name, description, price, stock) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [categoryId || null, name, description || null, price, stock || 0]
    );
    
    // Untuk response POST, kita juga perlu ambil category_name
    const productWithCategory = await db.query(`
      SELECT 
        p.id,
        p.name,
        c.name AS category_name,
        p.description,
        p.price,
        p.stock,
        p.is_available,
        p.created_at,
        p.updated_at
      FROM products p 
      LEFT JOIN categories c ON p.category_id=c.id 
      WHERE p.id = $1
    `, [rows[0].id]);
    
    const orderedProduct = {
      id: productWithCategory.rows[0].id,
      name: productWithCategory.rows[0].name,
      category_name: productWithCategory.rows[0].category_name,
      description: productWithCategory.rows[0].description,
      price: productWithCategory.rows[0].price,
      stock: productWithCategory.rows[0].stock,
      is_available: productWithCategory.rows[0].is_available,
      created_at: productWithCategory.rows[0].created_at,
      updated_at: productWithCategory.rows[0].updated_at
    };
    
    res.status(201).json({ message: 'Produk ditambahkan', product: orderedProduct });
  } catch (error) {
    console.error('Error di POST /products:', error);
    res.status(500).json({ message: 'Gagal menambah produk.' });
  }
});

/**
 * PUT /products/:id
 * Admin bisa mengubah data produk berdasarkan ID produk.
 */
router.put('/:id', authenticate, requireRoles('Admin'), async (req, res) => {
  const { categoryId, description, price, stock, is_available } = req.body;
  const productId = req.params.id;
  
  try {
    const { rowCount } = await db.query(
      `UPDATE products 
       SET category_id=$1, description=$2, price=$3, stock=$4, 
           is_available=COALESCE($5,is_available), updated_at=NOW() 
       WHERE id = $6`,
      [categoryId || null, description || null, price, stock, is_available, productId]
    );
    
    if (!rowCount) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    
    // Ambil data terbaru untuk response
    const updatedProduct = await db.query(`
      SELECT 
        p.id,
        p.name,
        c.name AS category_name,
        p.description,
        p.price,
        p.stock,
        p.is_available,
        p.created_at,
        p.updated_at
      FROM products p 
      LEFT JOIN categories c ON p.category_id=c.id 
      WHERE p.id = $1
    `, [productId]);
    
    const orderedProduct = {
      id: updatedProduct.rows[0].id,
      name: updatedProduct.rows[0].name,
      category_name: updatedProduct.rows[0].category_name,
      description: updatedProduct.rows[0].description,
      price: updatedProduct.rows[0].price,
      stock: updatedProduct.rows[0].stock,
      is_available: updatedProduct.rows[0].is_available,
      created_at: updatedProduct.rows[0].created_at,
      updated_at: updatedProduct.rows[0].updated_at
    };
    
    res.json({ 
      message: `Produk berhasil diupdate.`,
      product: orderedProduct 
    });
  } catch (error) {
    console.error('Error di PUT /products/:id:', error);
    res.status(500).json({ message: 'Gagal update produk.' });
  }
});

/**
 * DELETE /products/:id
 * Admin bisa hapus produk berdasarkan ID produk.
 */
router.delete('/:id', authenticate, requireRoles('Admin'), async (req, res) => {
  const productId = req.params.id;
  
  try {
    const { rowCount } = await db.query(
      'DELETE FROM products WHERE id = $1',
      [productId]
    );
    
    if (!rowCount) return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    res.json({ message: `Produk berhasil dihapus.` });
  } catch (error) {
    console.error('Error di DELETE /products/:id:', error);
    res.status(500).json({ message: 'Gagal hapus produk.' });
  }
});

module.exports = router;