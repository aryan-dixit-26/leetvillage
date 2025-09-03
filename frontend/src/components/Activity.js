import { Card, CardContent, CardHeader } from "./Card";

export function Activity({ items, loading }) {
    return (
        <Card loading={loading}>
            <CardHeader>Feed</CardHeader>
            <CardContent>
                <div className="feed">
                    <ul>
                        {items.map((item, id) => (
                            <li key={`id-${id}-${item.username}`}>
                                <p><b>{item.username}</b> just solved <b><a href={`https://leetcode.com/problems/${item.questionName}/`}>{item.questionName}</a></b></p>
                                <small>{new Date(item.timestamp).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}