import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import './App.css';

// Layout wrapper untuk pastikan scroll bekerja
const Layout = ({ children }) => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    }}>
      {children}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Route untuk halaman login */}
          <Route path="/login" element={<Login />} />
          
          {/* Route untuk dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Redirect root (/) ke /login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Optional: redirect semua route yang tidak dikenal ke login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;