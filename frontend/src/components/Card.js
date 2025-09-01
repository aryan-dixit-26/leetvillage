import Loader from "./Loader";

// Card components
export function Card({ children, loading }) {
    return <div className="card">{loading ? (<Loader />) : children}</div>

}

export function CardHeader({ children }) {
    return <div className="card-header">{children}</div>;
}


export function CardTitle({ children }) {
    return <h3 className="card-title">{children}</h3>;
}


export function CardContent({ children }) {
    return <div className="card-content">{children}</div>;
}