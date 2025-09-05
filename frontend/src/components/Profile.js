import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./Card";

export function Profile() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [userData, setUserData] = useState({})
    const [profileLoading, setProfileLoading] = useState(false);
    const { username, problems_solved, rank, avatar_url } = userData;

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

    return (
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
                </div>
            </CardContent>
        </Card>
    );
}