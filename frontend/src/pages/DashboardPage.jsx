import "./Dashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Data produk sesuai database PostgreSQL toko elektronik
  const databaseProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      category_id: 1,
      description: "Smartphone Apple dengan chip A17 Pro, kamera 48MP",
      price: 21000000,
      stock: 10,
      is_available: true,
      category_name: "Handphone",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
      specs: ["Chip A17 Pro", "Kamera 48MP", "Baterai 1 hari", "iOS 17"]
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      category_id: 1,
      description: "Flagship Samsung dengan kamera 200MP, S Pen",
      price: 19500000,
      stock: 8,
      is_available: true,
      category_name: "Handphone",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
      specs: ["Kamera 200MP", "S Pen", "Snapdragon 8 Gen 3", "5000mAh"]
    },
    {
      id: 3,
      name: "Xiaomi 14 Pro",
      category_id: 1,
      description: "Smartphone flagship dengan Snapdragon 8 Gen 3, kamera Leica",
      price: 15000000,
      stock: 12,
      is_available: true,
      category_name: "Handphone",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop",
      specs: ["Snapdragon 8 Gen 3", "Kamera Leica", "120W Charging", "Layar AMOLED"]
    },
    {
      id: 4,
      name: "MacBook Air M3",
      category_id: 2,
      description: "Laptop ringan bertenaga chip Apple M3, baterai 18 jam",
      price: 19500000,
      stock: 7,
      is_available: true,
      category_name: "Laptop",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      specs: ["Chip Apple M3", "Baterai 18 jam", "13.6 inch", "8GB RAM"]
    },
    {
      id: 5,
      name: "ASUS ROG Zephyrus G14",
      category_id: 2,
      description: "Laptop gaming dengan Ryzen 9 & RTX 4060, layar 120Hz",
      price: 24500000,
      stock: 5,
      is_available: true,
      category_name: "Laptop",
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
      specs: ["Ryzen 9", "RTX 4060", "Layar 120Hz", "32GB RAM"]
    },
    {
      id: 6,
      name: "HP Pavilion 15",
      category_id: 2,
      description: "Laptop produktivitas dengan Intel i7 Gen 13, SSD 1TB",
      price: 13500000,
      stock: 6,
      is_available: true,
      category_name: "Laptop",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
      specs: ["Intel i7 Gen 13", "SSD 1TB", "Layar Full HD", "Windows 11"]
    },
    {
      id: 7,
      name: "iPad Air 5",
      category_id: 3,
      description: "Tablet Apple dengan chip M1, layar Liquid Retina",
      price: 11500000,
      stock: 9,
      is_available: true,
      category_name: "Tablet",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
      specs: ["Chip M1", "Apple Pencil 2", "10.9 inch", "WiFi 6"]
    },
    {
      id: 8,
      name: "Samsung Galaxy Tab S9",
      category_id: 3,
      description: "Tablet Android dengan layar AMOLED 120Hz, S Pen included",
      price: 13000000,
      stock: 8,
      is_available: true,
      category_name: "Tablet",
      image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop",
      specs: ["Layar AMOLED", "S Pen", "Baterai 8400mAh", "Android 13"]
    },
    {
      id: 9,
      name: "PlayStation 5",
      category_id: 5,
      description: "Konsol gaming next-gen dari Sony, 4K 120Hz, SSD ultra-fast",
      price: 8800000,
      stock: 3,
      is_available: true,
      category_name: "Gaming",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop",
      specs: ["4K 120Hz", "SSD 825GB", "DualSense", "Backward Compatible"]
    },
    {
      id: 10,
      name: "Logitech MX Master 3",
      category_id: 4,
      description: "Mouse wireless ergonomis profesional, 4000 DPI, battery 70 hari",
      price: 1600000,
      stock: 15,
      is_available: true,
      category_name: "Aksesoris",
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop",
      specs: ["4000 DPI", "Baterai 70 hari", "Ergonomis", "Multi-Device"]
    }
  ];

  // Data kategori sesuai database PostgreSQL
  const databaseCategories = [
    { id: 1, name: "Handphone", count: 3, icon: "📱" },
    { id: 2, name: "Laptop", count: 3, icon: "💻" },
    { id: 3, name: "Tablet", count: 2, icon: "📱" },
    { id: 4, name: "Aksesoris", count: 1, icon: "🎧" },
    { id: 5, name: "Gaming", count: 1, icon: "🎮" }
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Menggunakan data produk dan kategori dari database
        setProducts(databaseProducts);
        setCategories(databaseCategories);
        
        // Simulasi loading
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

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
                <p>{category.count} products</p>
              </button>
            ))}
          </div>
        </div>

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
    src={product.image} 
    alt={product.name}
    className="product-image"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = `https://placehold.co/400x300/7b68ee/ffffff?text=${encodeURIComponent(product.name)}`;
    }}
  />
  
  {/* WISHLIST BUTTON - TAMBAHKAN INI */}
  <button className="wishlist-btn">
    ❤️
  </button>
  
  {/* STOCK BADGE - GANTI product-badge yang lama DENGAN INI */}
  <div className={`stock-badge ${
    product.stock === 0 ? 'stock-empty' :
    product.stock < 5 ? 'stock-low' :
    product.stock <= 10 ? 'stock-medium' : 'stock-high'
  }`}>
    {product.stock === 0 ? 'HABIS' : `Stok ${product.stock}`}
  </div>
  
  {/* CATEGORY BADGE - TETAP PERTAHANKAN */}
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
                        <button 
                          className="action-btn buy-btn"
                          onClick={() => addToCart(product)}
                          disabled={!product.is_available || product.stock === 0}
                        >
                          🛒 Beli Sekarang
                        </button>
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