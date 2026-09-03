# 🧠 Thinkboard

A simple, fast note-taking app. A full-stack web application built on the MERN stack (MongoDB, Express, React, Node) with Upstash Redis-based rate limiting.

## ✨ Features

- 📝 Create, list, edit, and delete notes (full CRUD)
- 🕒 Notes sorted newest-first by `createdAt`
- 🚦 API rate limiting via Upstash Redis (100 requests per 60 seconds) with a dedicated UI state
- 🔔 Instant feedback with `react-hot-toast`
- 🎨 Responsive UI built with Tailwind CSS + daisyUI (`forest` theme)
- 📦 Single-service deployment: in production, Express also serves the built React app

## 🛠 Tech Stack

**Backend:** Node.js, Express 4, Mongoose 8, Upstash Redis + Ratelimit, CORS, dotenv

**Frontend:** React 19, Vite, React Router, Axios, Tailwind CSS, daisyUI, Lucide React, react-hot-toast

## 📁 Project Structure

```
thinkboard/
├── backend/
│   └── src/
│       ├── config/
│       │   ├── db.js              # MongoDB connection
│       │   └── upstash.js         # Rate limiter configuration
│       ├── controllers/
│       │   └── notesController.js # Note CRUD logic
│       ├── middleware/
│       │   └── rateLimiter.js     # Request limiting middleware
│       ├── models/
│       │   └── Note.js            # Mongoose schema
│       ├── routes/
│       │   └── notesRoutes.js     # /api/notes routes
│       └── server.js              # Application entry point
├── frontend/
│   └── src/
│       ├── components/            # Navbar, NoteCard, RateLimitedUI, NotesNotFound
│       ├── pages/                 # HomePage, CreatePage, NoteDetailPage
│       ├── lib/                   # axios instance, helpers
│       └── App.jsx
└── package.json                   # Root build/start scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database ([MongoDB Atlas](https://www.mongodb.com/atlas) or a local instance)
- An [Upstash](https://upstash.com) Redis database (free tier is enough)

### 1. Clone the repository

```bash
git clone https://github.com/mert-eren515/thinkboard.git
cd thinkboard
```

### 2. Configure environment variables

Create a `backend/.env` file:

```env
MONGO_URI=<your_mongodb_connection_string>
PORT=5001

UPSTASH_REDIS_REST_URL=<upstash_rest_url>
UPSTASH_REDIS_REST_TOKEN=<upstash_rest_token>

NODE_ENV=development
```

### 3. Install dependencies and run

Backend (`http://localhost:5001`):

```bash
cd backend
npm install
npm run dev
```

Frontend (`http://localhost:5173`) — in a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

Base path: `/api/notes`

| Method   | Path   | Description             |
| -------- | ------ | ----------------------- |
| `GET`    | `/`    | Fetch all notes         |
| `GET`    | `/:id` | Fetch a single note     |
| `POST`   | `/`    | Create a new note       |
| `PUT`    | `/:id` | Update an existing note |
| `DELETE` | `/:id` | Delete a note           |

**Request body (`POST` / `PUT`):**

```json
{
  "title": "Note title",
  "content": "Note content"
}
```

When the rate limit is exceeded, every endpoint responds with `429 Too Many Requests` and the frontend renders a warning screen.

## 📦 Production Build

From the project root:

```bash
npm run build
npm start
```

`build` installs dependencies for both sides and builds the frontend; `start` boots the backend. When `NODE_ENV=production`, Express serves `frontend/dist` statically — so the app can be deployed as a single service (e.g. Render, Railway).

## 📄 License

ISC
