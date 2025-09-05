import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./Card";

export function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                setLoading(true)
                const res = await fetch("/api/leaderboard");
                const data = await res.json();
                setLeaders(data);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
            } finally {
                setLoading(false)
            }
        }
        fetchLeaderboard();
    }, []);

    // max problems solved for Hokage
    const maxProblems = 1200;

    return (
        <Card loading={loading}>
            <CardHeader>Leaderboard</CardHeader>
            <CardContent>
                <div className="leaderboard">
                    <ol>
                        {leaders.map((leader, index) => {
                            const percentage = Math.min(
                                (leader.problems_solved / maxProblems) * 100,
                                100
                            );

                            return (
                                <li key={index} className="leaderboard-item">
                                    <div className="leader-info">
                                        <span className="leader-avatar-user">
                                            <span className="leader-avatar">
                                                <a href={`https://leetcode.com/u/${leader.username}/`} target="_blank" rel="noreferrer">
                                                    <img
                                                        src={leader.avatar_url}
                                                        alt={`${leader.username} avatar`}
                                                        className="avatar"
                                                    />
                                                </a>
                                            </span>
                                            <span className="leader-name">{leader.username}</span>
                                        </span>
                                        <span className="leader-rank">{leader.rank}</span>
                                        <span className="leader-score">
                                            {leader.problems_solved} / {maxProblems}
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            </CardContent>
        </Card>
    );
}
