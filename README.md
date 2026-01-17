# LeetVillage 🏘️

LeetVillage is a community dashboard for DSA enthusiasts to track their progress, compete on leaderboards, and see real-time activity from fellow "villagers."

## 🚀 Features

- **Personalized Profiles**: Track your LeetCode problem count and "Village Rank."
- **Live Activity Feed**: See which problems other users are solving in real-time.
- **Global Leaderboard**: Compete with others based on total solved problems.
- **Secure Authentication**: Protected pages with JWT-based auth and password management.
- **Retro Aesthetic**: Modern functionality with a classic terminal/retro inspired design.

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Vanilla CSS.
- **Backend**: Node.js (Vercel Serverless Functions).
- **Database**: Supabase (PostgreSQL).
- **External API**: LeetCode GraphQL API.
- **Auth**: JWT (jsonwebtoken), Password hashing (bcryptjs).

## 💻 Local Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd leetvillage
   ```

2. **Install dependencies**:
   ```bash
   # Root directory
   npm install
   # Frontend directory
   cd frontend && npm install
   cd ..
   ```

3. **Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   JWT_SECRET=your_random_secret_key
   ```

4. **Database Setup**:
   Run the following SQL in your Supabase SQL Editor:
   ```sql
   ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
   ```

5. **Run the App**:
   Using Vercel CLI (recommended for full API support):
   ```bash
   npx vercel dev
   ```
   Or run frontend only (requires deployed API):
   ```bash
   cd frontend && npm start
   ```

6. **Initial Migration**:
   To set default passwords (username as password) for existing users:
   ```bash
   node api/migrations/addPasswordField.js
   ```

## 📂 Project Structure

- `/api`: Vercel serverless functions (backend logic).
- `/api/utils`: Shared backend utilities (auth, etc).
- `/api/migrations`: Database scripts.
- `/frontend`: React application.
- `/frontend/src/components`: UI components.
- `/frontend/src/context`: React Context providers (Auth).

## 🛡️ Authentication

LeetVillage uses JWT for secure sessions. Tokens are stored in `localStorage` and verified on page load. Existing users can login using their username as their initial password and should change it via the Profile panel immediately.

## 📈 Performance Optimization

The login flow is optimized to only refresh data for the authenticated user, ensuring sub-second response times even as the user base grows.

## 📄 License

ISC
