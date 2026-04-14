# ⚽ Sportly

![Sportly Banner](https://via.placeholder.com/1200x400/1e293b/ffffff?text=Sportly+-+Real-Time+Sports+Dashboard)

## 🚀 Project Overview

Sportly is a robust, dynamic, real-time sports dashboard that provides live score tracking, ongoing match commentary, and persistent data storage out of the box. Designed with scalability and reliability in mind, this multi-sport system effortlessly handles thousands of active events while streaming updates identically across multiple clients via WebSockets.

The platform provides an unmatched "wow factor" by employing modern, glassmorphism UI structures paired with ultra-low latency real-time interactions, fully solving complex multi-tab synchronization and backend robustness out of the box.

---

## 🧱 Architecture

The project employs a modern Monorepo structure, cleanly decoupled to allow completely independent deployments:

- **Client (`/client`)**: Next.js (React) powers an incredibly rich frontend. We use standard Vanilla CSS and modular components to maintain tight over CSS layouts, fluid animations, and high performance.
- **Server (`/server`)**: A reliable Node.js / Express backend with a PostgreSQL persistence layer. Powered by `Drizzle ORM`, the server guarantees consistency while broadcasting active changes using native WebSockets (`ws`).

## ⚙️ Tech Stack

### Frontend (Client)
- **Framework:** Next.js (React)
- **Styling:** Vanilla CSS (Modular, Modern variables)
- **State/Hooks:** Custom Hooks for fast real-time websocket rendering

### Backend (Server)
- **Runtime:** Node.js (TypeScript via `tsx`)
- **Framework:** Express
- **Database ORM:** Drizzle ORM
- **Database Provider:** PostgreSQL
- **Real-Time Engine:** WebSockets (`ws`)

---

## 📁 Folder Structure

```css
sportly/
├── client/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/            # Next.js App Router endpoints, Layouts & Pages
│   │   ├── components/     # Reusable UI widgets and logical parts
│   │   ├── hooks/          # React hooks (e.g. useWebsocket)
│   │   └── lib/            # Utility and shared logic
│   ├── package.json        # Frontend Dependencies
│   └── next.config.mjs     # Next.js Configuration
│
└── server/                 # Node.js + Express Backend
    ├── drizzle/            # Database configurations
    ├── src/
    │   ├── scheduler/      # Automated backend chronological jobs (Simulators)
    │   ├── services/       # Core Business Logic (DB Ops, updates)
    │   ├── utils/          # Health, Env validation & Bootstraps
    │   ├── websockets/     # WebSocket connectivity layer
    │   ├── app.ts          # Express Application Logic
    │   └── index.ts        # Fast-Fail Entry Point (Error tracking)
    ├── package.json        # Backend Dependencies
    └── drizzle.config.ts   # Drizzle Config
```

---

## 🧪 Local Development Setup

### 1. Requirements
- Node.js (v18+)
- PostgreSQL installed and running

### 2. Install Dependencies

In the root directory, install for both projects:
```bash
cd client && npm install
cd ../server && npm install
```

### 3. Database Initialization (Server)

Provide your environmental variables (see below section), then initialize your Drizzle schema:
```bash
cd server
npm run db:generate
npm run db:migrate
```

### 4. Run Both Environments
Run the **backend** (Terminal 1):
```bash
cd server
npm run dev
```

Run the **frontend** (Terminal 2):
```bash
cd client
npm run dev
```

---

## 🌍 Deployment Guide

This repository is optimized for quick deployment across **Vercel** and **Render**.

### 1. Vercel (Frontend)
1. Import your GitHub repository to Vercel.
2. Under "Root Directory", select `client`.
3. Framework Preset: *Next.js*.
4. Ensure environment variable `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_WS_URL` is set to point to your deployed Render URL.
5. Deploy.

### 2. Render (Backend)
1. Create a New **Web Service** on Render and map it to your repository.
2. Under "Root Directory", select `server`.
3. Select Runtime: **Node**.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Connect the database and fill out the Environment Variables listed below. Render will auto-allocate a port.

---

## 🔐 Environment Variables

The application protects against silent boot crashes! Set these correctly.

### Backend (`/server/.env`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret for auth tokens | `supersecret123` |
| `GOOGLE_CLIENT_ID` | OAuth2 Google Client ID | `123-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth2 Google Secret | `GOCSPX-...` |
| `CLIENT_URL` | Deployed Frontend URL (CORS) | `https://sportly-frontend.vercel.app` |
| `PORT` | Dynamic Server Port | `3001` |

### Frontend (`/client/.env.local`)

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_WS_URL` | Deployed Backend Websocket URI | `wss://sportly-backend.onrender.com/ws` |
| `NEXT_PUBLIC_API_URL` | Deployed Backend API URI | `https://sportly-backend.onrender.com` |

---

## 📡 API Endpoints

Once running, interact with robust backend services via standard endpoints:

| Endpoints | Method | Notes |
|---|---|---|
| `/ws` *(WebSocket)* | `WS` | Subscribes automatically; streams live matches and instant commentary chunks |
| `/api/auth/google` | `GET` | Initiates Google OAuth2 login flow |
| `/api/auth/callback/google` | `GET` | Handles Google OAuth callbacks |
| `/api/auth/me` | `GET` | Returns authenticated user session payload |

---

## 🧠 Future Improvements

- **Global Chat Rooms:** Dedicated, authenticated sports chat rooms via `/ws/chat/` namespaces.
- **User Portfolios/Predictions:** Implement a point-system where authenticated users can guess live-match results.
- **More Sports:** Extend our backend engine to handle NBA or NHL tracking simulations natively.
- **Dockerization:** Complete `docker-compose.yml` configuration mapping `pg`, `redis`, `client`, and `server`.