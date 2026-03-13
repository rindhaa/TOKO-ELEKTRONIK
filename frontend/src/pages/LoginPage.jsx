import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://toko-elektronik-production-255e.up.railway.app/auth/login", {
        username: formData.username,
        password: formData.password
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.alert(`Login Berhasil! Selamat datang ${user.username || user.name || "Artic Life"}`);

      if (user.role === "Admin" || user.role === "Kasir" || user.role === "Customer") {
        navigate("/dashboard");
      } else {
        setError("Role tidak dikenal");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

    } catch (err) {
      console.error("Login error:", err);

      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        "Login gagal. Periksa username dan password.";

      window.alert(errorMessage);
      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };
  

  // Generate partikel cahaya (20 butir)
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 10
  }));

  // Generate bintang 50 butir dengan warna random
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 3
  }));

  return (
    <div className="login-container">
      {/* Partikel cahaya melayang */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="light-particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}

      {/* Bubble kecil (4 buah) */}
      <div className="bubble bubble-1"></div>
      <div className="bubble bubble-2"></div>
      <div className="bubble bubble-3"></div>
      <div className="bubble bubble-4"></div>

      {/* Bintang 50 butir dengan warna variasi */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className="star-particle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
            '--twinkle-duration': `${star.duration}s`
          }}
        />
      ))}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-header">
          <div className="login-icon">🖥️</div>
          <h2>Electronic Store</h2>
          <p className="login-subtitle">Login Dashboard Management</p>
        </div>

        {error && (
          <div className="error-message show">
            {error}
          </div>
        )}

        <div className="input-group">
          <span className="input-icon">👤</span>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="username"
          />
        </div>

        <div className="input-group">
          <span className="input-icon">🔑</span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className={`login-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner">⚡</span>
              Memproses...
            </>
          ) : (
            "Login"
          )}
        </button>

        <div className="login-footer">
          <p>
            Belum punya akun? <Link to="/register">Daftar di sini</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;