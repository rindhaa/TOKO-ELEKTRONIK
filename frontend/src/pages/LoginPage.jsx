import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      // LANGSUNG KE BACKEND YANG CONNECT KE POSTGRESQL
      const response = await axios.post("http://localhost:3000/auth/login", {
        username: formData.username,
        password: formData.password
      });

      // Simpan data dari response backend
      const { token, user } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect berdasarkan role dari database
      if (user.role === "Admin" || user.role === "Kasir") {
        navigate("/dashboard");
      } else {
        setError("Hanya Admin dan Kasir yang dapat mengakses dashboard");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Login gagal. Periksa username dan password."
      );
    } finally {
      setLoading(false);
    }
  };

  // Generate soft stars (hanya untuk UI)
  const stars = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 8
  }));

  return (
    <div className="login-container">
      {/* Background Stars */}
      <div className="stars">
        {stars.map(star => (
          <div 
            key={star.id}
            className="star"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
              backgroundColor: `rgba(123, 104, 238, ${0.1 + Math.random() * 0.1})`
            }}
          />
        ))}
      </div>
      
      {/* Floating Tech Bubbles */}
      <div className="tech-bubble bubble-1"></div>
      <div className="tech-bubble bubble-2"></div>
      <div className="tech-bubble bubble-3"></div>
      
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
          <span className="input-icon">🔒</span>
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
              <span className="loading-spinner"></span>
              Memproses...
            </>
          ) : (
            "Login"
          )}
        </button>
        
        <div className="login-footer">
          <p className="demo-title">Database Credentials:</p>
          <div className="demo-credentials">
            <div><small>Data langsung dari PostgreSQL database</small></div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;