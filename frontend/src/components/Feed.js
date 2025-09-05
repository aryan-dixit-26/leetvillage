import { Activity } from "./Activity";
import { Leaderboard } from "./Leaderboard";
import { Profile } from "./Profile";

export default function Feed() {
  return (
    <div className="dashboard">
      <div className="sticky-panel">
        <Profile />
      </div>
      <div className="sticky-panel">
        <Activity />
      </div>
      <div className="sticky-panel">
        <Leaderboard />
      </div>
    </div>
  );
}
