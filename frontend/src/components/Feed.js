import { useEffect, useState } from "react";
import { Activity } from "./Activity";
import { Leaderboard } from "./Leaderboard";
import { Profile } from "./Profile";

export default function Feed() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState({})
  const [profileLoading, setProfileLoading] = useState(false);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feed, setFeed] = useState([])

  const dummyLeaders = [
    { id: 1, name: "Alice", score: 120 },
    { id: 2, name: "Bob", score: 95 },
    { id: 3, name: "Charlie", score: 80 },
  ];

  useEffect(() => {
    // Profile section
    async function updateUser(leetcodeId) {
      try {
        const res = await fetch(`/api/userData?username=${leetcodeId}`);
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to update user");
        }
        return await res.json(); // returns updated user object
      } catch (err) {
        console.error("updateUser error:", err.message);
        throw err;
      }
    }
    const handleUpdate = async (leetcodeId) => {
      try {
        setProfileLoading(true)
        const data = await updateUser(leetcodeId);
        setUserData(data);
      } catch (err) {
        console.error(err.message);
      }
      finally {
        setProfileLoading(false)
      }
    };
    handleUpdate(user.name)

    // Feed (Activity)
    async function fetchFeed() {
      try {
        setFeedLoading(true);
        const res = await fetch("/api/feed"); // your API endpoint
        const data = await res.json();
        setFeed(data);
      } catch (err) {
        console.error("Failed to fetch feed:", err);
      } finally {
        setFeedLoading(false);
      }
    }

    fetchFeed();
  }, [user.name, setFeed])

  return (
    <div className="dashboard">
      <div className="sticky-panel">
        <Profile username={userData?.username} solved={userData?.problems_solved} rank={userData?.rank} avatarUrl={userData?.avatar_url} loading={profileLoading} />
      </div>
      <div className="sticky-panel">
        <Activity items={feed} loading={feedLoading} />
      </div>
      <div className="sticky-panel">
        <Leaderboard leaders={dummyLeaders} />
      </div>
    </div>
  );
}
