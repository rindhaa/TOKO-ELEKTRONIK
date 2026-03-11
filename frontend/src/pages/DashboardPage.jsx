import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    specs: ""
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);


        // AMBIL DATA PRODUK DARI BACKEND
        const fetchProducts = async () => {
          setLoading(true);
          try {
            const token = localStorage.getItem("token");
            console.log("Token yang dikirim:", token);
            const response = await axios.get("http://localhost:3000/products", {
              headers: { Authorization: `Bearer ${token}` }
            });

            const productsData = response.data.products;
            setProducts(productsData);

            // HITUNG JUMLAH PRODUK PER KATEGORI
            const categoryCount = {};
            productsData.forEach(product => {
              const catName = product.category_name;
              categoryCount[catName] = (categoryCount[catName] || 0) + 1;
            });

            // SET CATEGORIES DENGAN DATA DARI DATABASE
            const categoriesFromDB = [
              { id: 1, name: "Handphone", icon: "📱" },
              { id: 2, name: "Laptop", icon: "💻" },
              { id: 3, name: "Tablet", icon: "📱" },
              { id: 4, name: "Aksesoris", icon: "🎧" },
              { id: 5, name: "Gaming", icon: "🎮" }
            ];

            setCategories(categoriesFromDB.map(cat => ({
              ...cat,
              count: categoryCount[cat.name] || 0
            })));

          } catch (error) {
            console.error("Gagal mengambil produk:", error);
            if (error.response?.status === 401) {
              navigate("/");
            }
          } finally {
            setLoading(false);
          }
        };

        fetchProducts();

      } catch (error) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  // CEK ROLE USER - LETAKKAN DI SINI (setelah useEffect, sebelum return)
  const userRole = user?.role;
  const isAdmin = userRole === "Admin";
  const isKasir = userRole === "Kasir";
  const isCustomer = userRole === "Customer";
  const isAdminOrKasir = isAdmin || isKasir;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Handphone': '📱',
      'Laptop': '💻',
      'Tablet': '📱',
      'Aksesoris': '🎧',
      'Gaming': '🎮'
    };
    return icons[categoryName] || '📦';
  };

  // Filter products berdasarkan kategori dan pencarian
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" ||
      product.category_name === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Fungsi untuk menambahkan produk ke keranjang
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    alert(`✅ ${product.name} ditambahkan ke keranjang!`);
  };

  // Menghitung total harga keranjang
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Fungsi checkout
  const proceedToCheckout = () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    alert(`🛒 Checkout berhasil! Total: ${formatCurrency(getCartTotal())}`);
    setCart([]);
  };

  // TAMBAHKAN INI (Fungsi hapus produk)
  const handleDelete = async (productId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:3000/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProducts(products.filter(p => p.id !== productId));
      alert("✅ Produk berhasil dihapus!");

    } catch (error) {
      console.error("Gagal hapus produk:", error);
      alert("❌ Gagal menghapus produk");
    } finally {
      setLoading(false);
    }
  };

  // Handle input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit form tambah produk
  const handleAddProduct = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Convert specs dari string ke array (pisah koma)
      const specsArray = formData.specs.split(',').map(s => s.trim());

      const response = await axios.post("http://localhost:3000/products", {
        categoryId: parseInt(formData.categoryId),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image_url: formData.image_url,
        specs: specsArray
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Tambah produk baru ke state
      setProducts([...products, response.data.product]);

      // Reset form & tutup modal
      setFormData({
        name: "", categoryId: "", description: "", price: "", stock: "", image_url: "", specs: ""
      });
      setShowForm(false);

      alert("✅ Produk berhasil ditambahkan!");

    } catch (error) {
      console.error("Gagal tambah produk:", error);
      alert("❌ Gagal menambah produk");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat produk toko elektronik...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <div className="brand-logo">🏪</div>
          <div>
            <div className="brand-text">ELECTRO STORE</div>
            <div className="brand-subtext">Toko Elektronik Premium</div>
          </div>
        </div>

        <div className="nav-center">
          <div className="cart-info">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{cart.length} items</span>
            <span className="cart-total">{formatCurrency(getCartTotal())}</span>
          </div>
        </div>

        <div className="user-profile">
          <div className="user-avatar">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || "Admin"}</div>
            <div className="user-role">{user?.role || "Manager"}</div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Keluar
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">
            Selamat Datang di <span className="highlight">Electro Store</span>! 🚀
          </h1>
          <p className="hero-subtitle">
            Temukan elektronik terbaru dengan kualitas terbaik dan harga kompetitif
          </p>

          {/* SEARCH BAR */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Cari produk elektronik..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              🔍 Cari
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="categories-section">
          <h2 className="section-title">📁 Kategori Produk</h2>
          <div className="categories-grid">
            <button
              className={`category-card-large ${selectedCategory === "all" ? "active" : ""}`}
              onClick={() => setSelectedCategory("all")}
            >
              <span className="category-icon-large">📦</span>
              <h3>Semua Produk</h3>
              <p>{products.length} items</p>
            </button>

            {categories.map(category => (
              <button
                key={category.id}
                className={`category-card-large ${selectedCategory === category.name ? "active" : ""}`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <span className="category-icon-large">{category.icon}</span>
                <h3>{category.name}</h3>
                {category.count > 0 && <p>{category.count} products</p>}
              </button>
            ))}
          </div>
        </div>

        {/* TOMBOL TAMBAH PRODUK (HANYA UNTUK ADMIN) */}
        {isAdmin && (
          <div className="add-product-container">
            <button className="add-product-btn" onClick={() => setShowForm(true)}>
              + Tambah Produk Baru
            </button>
          </div>
        )}

        {/* MODAL FORM TAMBAH PRODUK */}
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Tambah Produk Baru</h3>
              <form onSubmit={handleAddProduct}>
                <div className="form-group">
                  <label>Nama Produk</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Kategori</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Harga</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Stok</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>URL Gambar</label>
                  <input
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Spesifikasi (pisah dengan koma)</label>
                  <input
                    type="text"
                    name="specs"
                    value={formData.specs}
                    onChange={handleInputChange}
                    placeholder="Contoh: Chip A17 Pro, Kamera 48MP, Baterai 1 hari"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>
                    Batal
                  </button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Menyimpan..." : "Simpan Produk"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="products-section">
          <div className="section-header">
            <h2 className="section-title">🔥 Produk Terpopuler</h2>
            <div className="products-info">
              <span className="products-count">
                {filteredProducts.length} produk ditemukan
              </span>
              <span className="products-total-value">
                Total nilai: {formatCurrency(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}
              </span>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  {/* Product Image */}
                  <div className="product-image-container">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/400x300/7b68ee/ffffff?text=${encodeURIComponent(product.name)}`;
                      }}
                    />
                    <div className="product-badge">
                      {product.is_available ? (
                        <span className="badge-available">
                          <span className="badge-dot"></span>
                          Tersedia
                        </span>
                      ) : (
                        <span className="badge-unavailable">Habis</span>
                      )}
                    </div>
                    <div className="product-category-badge">
                      {getCategoryIcon(product.category_name)} {product.category_name}
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="product-content">
                    <h3 className="product-title">{product.name}</h3>

                    <p className="product-description">
                      {product.description}
                    </p>

                    {/* Product Specs */}
                    <div className="product-specs">
                      {product.specs && product.specs.map((spec, index) => (
                        <span key={index} className="spec-tag">
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="product-footer">
                      <div className="price-section">
                        <div className="product-price">
                          {formatCurrency(product.price)}
                        </div>
                        <div className="product-stock">
                          <span className="stock-label">Stok:</span>
                          <span className={`stock-value ${product.stock < 5 ? "low" : ""}`}>
                            {product.stock} unit
                          </span>
                        </div>
                      </div>

                      <div className="product-actions">
                        {isAdmin ? (
                          /* UNTUK ADMIN */
                          <>
                            <button
                              className="action-btn edit-btn"
                              onClick={() => console.log("Edit produk", product.id)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDelete(product.id)}
                            >
                              🗑️ Hapus
                            </button>
                          </>
                        ) : isKasir ? (
                          /* UNTUK KASIR */
                          <span className="read-only-badge">🔍 Hanya lihat</span>
                        ) : (
                          /* UNTUK CUSTOMER */
                          <button
                            className="action-btn buy-btn"
                            onClick={() => addToCart(product)}
                            disabled={!product.is_available || product.stock === 0}
                          >
                            🛒 Beli Sekarang
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Tidak ada produk ditemukan</h3>
              <p>Coba ubah kata kunci pencarian atau pilih kategori lain</p>
            </div>
          )}
        </div>

        {/* Cart Summary (Floating) */}
        {cart.length > 0 && (
          <div className="cart-summary">
            <div className="cart-summary-content">
              <div className="cart-items-count">
                <span className="cart-icon">🛒</span>
                <span>{cart.length} item di keranjang</span>
              </div>
              <div className="cart-total-amount">
                Total: <strong>{formatCurrency(getCartTotal())}</strong>
              </div>
              <button
                className="checkout-btn"
                onClick={proceedToCheckout}
              >
                💳 Checkout Sekarang
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="dashboard-footer">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand-logo">🏪</div>
              <div>
                <div className="brand-text">ELECTRO STORE</div>
                <div className="brand-subtext">Toko Elektronik Terpercaya</div>
              </div>
            </div>
            <div className="footer-stats">
              <div className="footer-stat">
                <span className="stat-number">{products.length}</span>
                <span className="stat-label">Produk</span>
              </div>
              <div className="footer-stat">
                <span className="stat-number">
                  {categories.length}
                </span>
                <span className="stat-label">Kategori</span>
              </div>
              <div className="footer-stat">
                <span className="stat-number">
                  {products.reduce((sum, p) => sum + p.stock, 0)}
                </span>
                <span className="stat-label">Stok Total</span>
              </div>
            </div>
          </div>
          <p className="footer-copyright">
            © 2024 Electro Store. Data produk sesuai database PostgreSQL toko elektronik.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;