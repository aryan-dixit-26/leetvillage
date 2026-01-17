import { createClient } from "@supabase/supabase-js";
import { getLeetVillageRank } from "./userData";
import { hashPassword } from "./utils/auth.js";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.local" });
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, leetcodeId } = req.body;

  console.log(req.body)
  if (!username || !leetcodeId) {
    return res.status(400).json({ error: "Username and leetcodeId required" });
  }

  try {
    // --- Validate and fetch user data from LeetCode ---
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

    const leetcodeData = await response.json();
    const userData = leetcodeData.data?.matchedUser;

    if (!userData) {
      return res.status(400).json({ error: "Invalid LeetCode user" });
    }

    // --- Extract required fields ---
    const avatar_url = userData.profile.userAvatar || null;
    const problems_solved =
      userData.submitStatsGlobal.acSubmissionNum?.find(
        (s) => s.difficulty === "All"
      )?.count || 0;

    const rank = getLeetVillageRank(problems_solved);

    // Hash default password (username)
    const hashedPassword = await hashPassword(username);

    // --- Insert into Supabase ---
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          leetcode_id: leetcodeId,
          avatar_url,
          rank,
          problems_solved,
          password: hashedPassword,
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({
      message: "User added successfully",
      user: data[0],
    });
  } catch (err) {
    console.error("Error adding user:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
