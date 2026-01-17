import { useNavigate } from 'react-router-dom';
import '../App.css';
import { useState } from 'react';
import Loader from './Loader';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!userName || !password) {
      alert('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      await login(userName, password);
      navigate('/feed');
    } catch (err) {
      alert(err.message || 'Login failed!');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      {loading ? (
        <div style={{ width: "100%", height: "100vh" }}>
          <Loader />
        </div>
      ) : (
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">Leet Village Gate</h1>
            <p className="login-subtitle">Enter your credentials to continue</p>

            <input
              className="login-input"
              name="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Username"
            />

            <input
              className="login-input"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Password"
            />

            <button className="login-button" onClick={handleLogin}>
              Login
            </button>

            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#888' }}>
              First time? Use your username as password
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
