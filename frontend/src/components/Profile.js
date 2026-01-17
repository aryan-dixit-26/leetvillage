import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "./Card";
import { useAuth } from "../context/AuthContext";
import ChangePassword from "./ChangePassword";

export function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [userData, setUserData] = useState({})
    const [profileLoading, setProfileLoading] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const { username, problems_solved, rank, avatar_url } = userData;
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        async function updateUser(leetcodeId) {
            try {
                const res = await fetch(`/api/userData?username=${leetcodeId}`);
                if (!res.ok) {
                    const error = await res.json();
                    throw new Error(error.error || "Failed to update user");
                }
                return await res.json();
            } catch (err) {
                console.error("updateUser error:", err.message);
                throw err;
            }
        }
        const handleUpdate = async (leetcodeId) => {
            try {
                setProfileLoading(true)
                const data = await updateUser(leetcodeId);
                setUserData(data);
            } catch (err) {
                console.error(err.message);
            }
            finally {
                setProfileLoading(false)
            }
        };
        handleUpdate(user.name)
    }, [user.name])

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <Card loading={profileLoading}>
                <CardHeader>Profile</CardHeader>
                <CardContent>
                    <div className="profile">
                        <div className="image-container">
                            <img
                                src={avatar_url}
                                alt={`${username} avatar`}
                                className="avatar"
                            />
                        </div>
                        <p><span className="font-bold">User:</span> {username}</p>
                        <p><span className="font-bold">Solved:</span> {problems_solved}</p>
                        <p><span className="font-bold">Rank:</span> #{rank}</p>
                        
                        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button 
                                className="login-button" 
                                onClick={() => setShowChangePassword(true)}
                                style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                            >
                                Change Password
                            </button>
                            <button 
                                className="login-button" 
                                onClick={handleLogout}
                                style={{ fontSize: '0.85rem', padding: '0.5rem', background: '#dc3545' }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {showChangePassword && (
                <ChangePassword onClose={() => setShowChangePassword(false)} />
            )}
        </>
    );
}