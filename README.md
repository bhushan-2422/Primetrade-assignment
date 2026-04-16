# Task Manager App

A full-stack task management app with JWT-based auth and a React frontend.

---

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

---

### Backend Setup

```bash
git clone https://github.com/bhushan-2422/Primetrade-assignment.git
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
CORS_ORIGIN=
MONGODB_URI=
PORT=3000
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=10d
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
```

Start the server:

```bash
npm run dev
```

Server runs at: `http://localhost:3000`

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App runs at: `http://localhost:5173`


## Project Structure

```
backend
├── src/
│   ├── controllers/
│   ├── middleware/
│   │   └── verifyJWT.js
│   ├── models/
│   ├── routes/
│   │   └── user.routes.js
│   └── index.js

frontend/
    └── src/
        ├── context/
        │   └── UserContext.jsx
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── SignUpPage.jsx
        │   └── TaskDashboard.jsx
        ├── components/
        │   └── ProtectedRoute.jsx
        ├── App.jsx
        └── main.jsx
```

---

## API Reference

Base URL: `/api/v1/user`

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signUp` | No | Register a new user |
| POST | `/login` | No | Login and receive JWT |
| POST | `/getCurrentUser` | Yes | Get logged-in user info |
| POST | `/logout` | Yes | Logout current user |

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/createTask` | Yes | Create a new task |
| POST | `/deleteTask` | Yes | Delete a task by ID |
| POST | `/getAllTask` | Yes | Fetch all tasks for user |
| POST | `/markAsComplete` | Yes | Toggle task completion |

> **Auth** = requires `Authorization: Bearer <token>` header

---

## Authentication Flow

1. User signs up or logs in via `/signUp` or `/login`
2. Server returns a JWT token
3. Token is stored in `localStorage` via `UserContext`
4. Protected routes use `ProtectedRoute.jsx` to redirect unauthenticated users
5. All task endpoints require the token in the `Authorization` header

---

## Environment Variables Summary

### Backend

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 8000) |
| `MONGODB_URI` | MongoDB connection string |
| `CORS_ORIGIN` | Allowed frontend origin '*' for all |
| `ACCESS_TOKEN_SECRET` | any secret string to generate acccess token |
| `REFRESH_TOKEN_SECRET` | any secret string to generate refresh token |


---

## Available Scripts

### Backend

```bash
npm run dev      # Start with nodemon
npm start        # Start in production
```

### Frontend

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```
