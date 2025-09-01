import { createClient } from "@supabase/supabase-js";
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.local" });
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export function getLeetVillageRank(problemsSolved) {
  if (problemsSolved >= 0 && problemsSolved < 200) {
    return "Genin";
  } else if (problemsSolved >= 200 && problemsSolved < 400) {
    return "Chunin";
  } else if (problemsSolved >= 400 && problemsSolved < 800) {
    return "Jonin";
  } else if (problemsSolved >= 800 && problemsSolved < 1200) {
    return "Sanin";
  } else if (problemsSolved >= 1200) {
    return "Hokage";
  } else {
    return "Unknown"; // for negative numbers or invalid input
  }
}

export default async function handler(req, res) {
  const { username } = req.query; // here username = leetcode_id

  if (!username) {
    return res.status(400).json({ error: "LeetCode username (leetcode_id) is required" });
  }

  try {
    // --- Fetch data from LeetCode GraphQL ---
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            userAvatar
          }
          submitStats {
            acSubmissionNum {
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
        "User-Agent": "Mozilla/5.0", // mimics a browser
        "Referer": "https://leetcode.com",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    const leetcodeData = await response.json();

    const user = leetcodeData.data?.matchedUser;
    const submitStats = user?.submitStats;

    if (!user) {
      return res.status(404).json({ error: "LeetCode user not found" });
    }

    // --- Extract useful fields ---
    const avatar_url = user.profile?.userAvatar || null;

    const problems_solved = submitStats?.acSubmissionNum[0]?.count;

    // --- Upsert into Supabase ---
    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          username: user.username,
          leetcode_id: username,
          avatar_url,
          problems_solved,
          last_updated: new Date().toISOString(),
          rank: getLeetVillageRank(problems_solved),
        },
        { onConflict: "leetcode_id" }
      )
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error syncing LeetCode user:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
