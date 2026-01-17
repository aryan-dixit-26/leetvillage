# leetVillage 🏘️
> The social hub for LeetCode Shinobis.

**leetVillage** is a social competitive platform designed to make the lonely grind of Data Structures and Algorithms (DSA) more interactive and community-driven. It transforms LeetCode stats into a "Village" ecosystem where you can track progress, compete with peers, and stay motivated together.

---

## ✨ Features

### 🏯 The Great Hall (Leaderboard)
Compete for the title of the Village Head. The leaderboard ranks users based on their total solved problems, providing a clear competitive edge to your daily practice.

### 📜 Digital Scroll (Activity Feed)
Stay in the loop with the digital scroll. See real-time updates as your fellow villagers solve problems, complete challenges, and level up. Never miss a beat in the village's collective growth.

### 👤 Shinobi Dossier (Profiles)
Your personal progress card. Display your total solved count, global rank, and unique avatar. It's your identity within the village.

### 🔐 Secure Sanctuary (Authentication)
Integrated login system using JWT and hashed passwords. Securely manage your account and protect your progress with built-in password management.

---

## 🛠️ Tech Architecture

leetVillage is built with a modern, serverless focus for high scalability and low maintenance:

- **Frontend**: A lightning-fast **React** SPA styled with a custom terminal-retro aesthetic (Vanilla CSS).
- **Backend API**: **Node.js** serverless functions hosted on **Vercel**, ensuring zero cold-start latency for core flows.
- **Persistence**: **Supabase** (PostgreSQL) handles user data, auth state, and leaderboard rankings.
- **Data Synchronization**: Automated sync with the **LeetCode GraphQL API** to keep village stats fresh.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Vercel CLI (`npm install -g vercel`)
- A Supabase Project

### 2. Setup
```bash
# Clone and Install
git clone https://github.com/your-username/leetVillage.git
cd leetVillage
npm install
cd frontend && npm install && cd ..

# Environment Setup
# Create .env.local in root with:
# SUPABASE_URL=...
# SUPABASE_KEY=...
# JWT_SECRET=...
```

### 3. Launching the Village
```bash
# Start the full environment (API + Frontend)
vercel dev
```

---

## 🗺️ Project Roadmap

- [ ] **Shinobi Sparring**: Head-to-head DSA challenges.
- [ ] **Clans**: Group-based leaderboards and private feeds.
- [ ] **Skill Badges**: Achievement-based icons for specific tag streaks (e.g., "DP Master").
- [ ] **Mobile App**: A companion PWA for on-the-go tracking.

---

## 🛡️ License
Distributed under the ISC License. See `LICENSE` for more information.

---
*Built with ❤️ by and for the LeetCode community.*
