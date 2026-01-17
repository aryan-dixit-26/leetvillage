import { createClient } from "@supabase/supabase-js";
import { getLeetVillageRank } from "./userData";
import { comparePassword, generateToken } from "./utils/auth.js";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.local" });
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function fetchLeetCodeData(leetcodeId) {
  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          userAvatar
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }
  `;

  const response = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
      "Referer": "https://leetcode.com",
    },
    body: JSON.stringify({
      query,
      variables: { username: leetcodeId },
    }),
  });

  const data = await response.json();
  return data.data?.matchedUser || null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Check if username exists and get password
  const { data: user, error } = await supabase
    .from("users")
    .select("id, username, rank, problems_solved, password")
    .eq("username", username)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  // --- refresh all users data ---
  try {
    const { data: allUsers } = await supabase.from("users").select("*");

    for (const u of allUsers) {
      const userData = await fetchLeetCodeData(u.leetcode_id);

      if (userData) {
        const avatar_url = userData.profile.userAvatar || null;
        const problems_solved =
          userData.submitStatsGlobal.acSubmissionNum?.find(
            (s) => s.difficulty === "All"
          )?.count || 0;

        const rank = getLeetVillageRank(problems_solved);

        await supabase
          .from("users")
          .update({ avatar_url, problems_solved, rank })
          .eq("id", u.id);
      }
    }
  } catch (err) {
    console.error("Failed to refresh users:", err);
    // don't block login just because refresh failed
  }

  // Generate JWT token
  const token = generateToken(user.id, user.username);

  // Return user data with token
  return res.status(200).json({
    message: "Login successful",
    user: { name: user.username },
    token,
  });
}
