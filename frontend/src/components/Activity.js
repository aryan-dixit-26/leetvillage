import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "./Card";

export function Activity() {
    const [feedLoading, setFeedLoading] = useState(false);
    const [feed, setFeed] = useState([])

    useEffect(() => {
        async function fetchFeed() {
            try {
                setFeedLoading(true);
                const res = await fetch("/api/feed");
                const data = await res.json();
                setFeed(data);
            } catch (err) {
                console.error("Failed to fetch feed:", err);
            } finally {
                setFeedLoading(false);
            }
        }
        fetchFeed();
    }, [setFeed])


    return (
        <Card loading={feedLoading}>
            <CardHeader>Feed</CardHeader>
            <CardContent>
                <div className="feed">
                    <ul>
                        {feed.map((item, id) => (
                            <li key={`id-${id}-${item.username}`}>
                                <span className="feed-avatar">
                                    <a href={`https://leetcode.com/u/${item.username}/`} target="_blank" rel="noreferrer">
                                        <img
                                            src={item.avatar_url}
                                            alt={`${item.username} avatar`}
                                            className="avatar"
                                        />
                                    </a>
                                </span>
                                <span className="feed-text">
                                    <p><b>{item.username}</b> just solved <b><a href={`https://leetcode.com/problems/${item.questionName}/`} target="_blank" rel="noreferrer">{item.questionName}</a></b></p>
                                    <small>{new Date(item.timestamp).toLocaleString()}</small>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}