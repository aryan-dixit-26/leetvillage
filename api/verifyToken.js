import { verifyToken } from "./utils/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token required" });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ 
      valid: false, 
      error: "Invalid or expired token" 
    });
  }

  return res.status(200).json({ 
    valid: true, 
    user: { 
      userId: decoded.userId, 
      username: decoded.username 
    } 
  });
}
