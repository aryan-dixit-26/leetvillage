import { createClient } from "@supabase/supabase-js";
import { getLeetVillageRank } from "./userData";

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
    // Also allow GET for cron jobs if needed, but keeping POST for safety
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }
  }

  try {
    const { data: allUsers, error: fetchError } = await supabase.from("users").select("*");
    
    if (fetchError) throw fetchError;

    const results = [];
    for (const u of allUsers) {
      const userData = await fetchLeetCodeData(u.leetcode_id || u.username);

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
        
        results.push({ username: u.username, status: "updated" });
      } else {
        results.push({ username: u.username, status: "failed" });
      }
    }

    return res.status(200).json({ 
        message: "Refresh complete", 
        results 
    });

  } catch (err) {
    console.error("Refresh failed:", err);
    return res.status(500).json({ error: "Failed to refresh data" });
  }
}
