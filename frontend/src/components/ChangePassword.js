import { useState } from 'react';
import ReactDOM from 'react-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

export default function ChangePassword({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { changePassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (newPassword.length < 3) {
      alert('Password must be at least 3 characters long');
      return;
    }

    try {
      setLoading(true);
      await changePassword(currentPassword, newPassword);
      alert('Password changed successfully!');
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '1.5rem' }}>Change Password</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            disabled={loading}
          />

          <input
            className="login-input"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            disabled={loading}
          />

          <input
            className="login-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
            disabled={loading}
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              type="submit" 
              className="login-button" 
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            <button 
              type="button" 
              className="login-button" 
              onClick={onClose}
              disabled={loading}
              style={{ flex: 1, background: '#666' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
