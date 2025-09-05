import { createClient } from "@supabase/supabase-js";
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.local" });
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  const limitPerUser = 5; // number of recent submissions per user

  try {
    // --- Fetch all users from Supabase ---
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("username, leetcode_id, avatar_url");

    if (usersError) {
      return res.status(500).json({ error: "Failed to fetch users from Supabase" });
    }

    // --- Fetch recent submissions for each user ---
    const feedPromises = users.map(async (user) => {
      const query = `
        query recentAcSubmissions($username: String!, $limit: Int!) {
          recentAcSubmissionList(username: $username, limit: $limit) {
            id
            title
            titleSlug
            timestamp
          }
        }
      `;

      try {
        const response = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://leetcode.com",
          },
          body: JSON.stringify({
            query,
            variables: { username: user.leetcode_id, limit: limitPerUser },
          }),
        });

        const leetcodeData = await response.json();
        const submissions = leetcodeData.data?.recentAcSubmissionList || [];

        // Map submissions to feed messages
        return submissions.map(sub => ({
          username: user.username,
          questionName: sub.titleSlug,
          timestamp: sub.timestamp * 1000, // convert to milliseconds
          avatar_url: user.avatar_url,
        }));
      } catch (err) {
        console.error(`Failed fetching submissions for ${user.username}:`, err);
        return [];
      }
    });

    // --- Wait for all users to finish ---
    const allFeedsNested = await Promise.all(feedPromises);

    // --- Flatten the array and sort by timestamp (latest first) ---
    const allFeeds = allFeedsNested.flat().sort((a, b) => b.timestamp - a.timestamp);

    // --- Convert timestamp to ISO string for frontend ---
    const formattedFeed = allFeeds.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp).toISOString()
    }));

    return res.status(200).json(formattedFeed);

  } catch (err) {
    console.error("Error generating feed:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
