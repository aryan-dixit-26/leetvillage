import { useNavigate } from 'react-router-dom';
import '../App.css';
import { useState } from 'react';
import Loader from './Loader';

function Login() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function login(username) {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data.user;
  }

  const handleLogin = async () => {
    try {
      setLoading(true)
      const loginDetails = await login(userName);
      localStorage.setItem("user", JSON.stringify(loginDetails));
      navigate("/feed");
    } catch (err) {
      alert("Login failed!");
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading ? (<div style={{ width: "100%", height: "100vh" }}><Loader /> </div>) :
        (
          <div className="login-container">
            <div className="login-card">
              <h1 className="login-title">Leet Village Gate</h1>
              <p className="login-subtitle">Enter your username to continue</p>

              <input
                className="login-input"
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Username"
              />

              <button className="login-button" onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
        )}
    </>
  );
}

export default Login;
