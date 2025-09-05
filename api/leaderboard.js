if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.local" });
}
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function getLeaderboard(req, res) {
  const { data, error } = await supabase
    .from("users")
    .select("username, problems_solved, rank, avatar_url")
    .order("problems_solved", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}

export default getLeaderboard;
