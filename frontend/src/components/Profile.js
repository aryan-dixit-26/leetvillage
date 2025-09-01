import { Card, CardContent, CardHeader } from "./Card";

export function Profile({ username, solved, rank, avatarUrl, loading }) {
    return (
        <Card loading={loading}>
            <CardHeader>Profile</CardHeader>
            <CardContent>
                <div className="profile">
                    <div className="image-container">
                        <img
                            src={avatarUrl}
                            alt={`${username} avatar`}
                            className="avatar"
                        />
                    </div>
                    <p><span className="font-bold">User:</span> {username}</p>
                    <p><span className="font-bold">Solved:</span> {solved}</p>
                    <p><span className="font-bold">Rank:</span> #{rank}</p>
                </div>
            </CardContent>
        </Card>
    );
}