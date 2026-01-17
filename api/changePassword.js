import { createClient } from "@supabase/supabase-js";
import { comparePassword, hashPassword } from "./utils/auth.js";
import { verifyToken } from "./utils/auth.js";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.local" });
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify JWT token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }

  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ 
      error: "Current password and new password required" 
    });
  }

  if (newPassword.length < 3) {
    return res.status(400).json({ 
      error: "New password must be at least 3 characters long" 
    });
  }

  try {
    // Get user from database
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("id, username, password")
      .eq("id", decoded.userId)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password in database
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", user.id);

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({ 
      message: "Password changed successfully" 
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: "Failed to change password" });
  }
}
