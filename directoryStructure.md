leetcode-shinobi-dashboard/
│
├── frontend/                # Your React frontend (can be separate or inside root)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── package.json
│   └── ...
│
├── api/                     # Serverless backend lives here (Vercel auto-detects)
│   ├── update.js            # Function: update LeetCode stats
│   ├── leaderboard.js       # Function: leaderboard data
│   └── user.js              # Function: fetch single user data
│
├── .env.local               # API keys (Supabase, etc.)
├── vercel.json              # Vercel config (optional)
├── package.json             # Root package.json (for backend deps)
└── README.md
