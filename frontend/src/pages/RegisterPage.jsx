import "./Register.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "Customer"
      });

      setSuccess("Registrasi berhasil! Mengalihkan ke halaman login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error("Register error:", err);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Registrasi gagal. Silakan coba lagi.";
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // Generate soft stars
  const stars = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 8
  }));

  return (
    <div className="register-container">
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
      
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-header">
          <div className="register-icon">📝</div>
          <h2>Buat Akun Baru</h2>
          <p className="register-subtitle">Daftar untuk berbelanja di Electro Store</p>
        </div>
        
        {error && (
          <div className="error-message show">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message show">
            {success}
          </div>
        )}
        
        <div className="input-group">
          <span className="input-icon">👤</span>
          <input
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <span className="input-icon">🔤</span>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="input-group">
          <span className="input-icon">📧</span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
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
          />
        </div>

        <div className="input-group">
          <span className="input-icon">✓</span>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Konfirmasi Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          className={`register-button ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Mendaftar...
            </>
          ) : (
            "Daftar"
          )}
        </button>
        
        {/* TOMBOL KEMBALI KE LOGIN - UDAH ADA */}
        <div className="register-footer">
          <p>Sudah punya akun? <Link to="/login">Login di sini</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Register;