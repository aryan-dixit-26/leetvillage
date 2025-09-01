import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Feed from "./components/Feed";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/feed",
    element: <Feed />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}