# Bus Ticket Booking System (Monorepo)

A full-stack web app for browsing buses, real-time seat availability, booking/canceling seats, and an admin portal for management.

## Tech Stack
- Frontend: React (Vite), Tailwind CSS, Axios, React Router, Socket.io-client
- Backend: Node.js, Express.js, Prisma (PostgreSQL), Socket.io, JWT, bcrypt, CORS, dotenv

## Structure

```
backend/
  src/
    config/
      db.js
      env.js
    controllers/
    middleware/
    models/
    routes/
    sockets/
    utils/
    server.js
  prisma/
    schema.prisma
  package.json
  .env.example

frontend/
  public/
  src/
    components/
    pages/
    context/
    services/
    App.jsx
    main.jsx
    index.css
  package.json
  tailwind.config.js
  postcss.config.js

docker-compose.yml
.gitignore
README.md
```

## Quick Start

1) Copy env and set variables
```
cp backend/.env.example backend/.env
```

2) Start Postgres via Docker (optional)
```
docker compose up -d db
```

3) Install dependencies
```
cd backend && npm install && cd ../frontend && npm install && cd ..
```

4) Initialize database
```
cd backend
npx prisma migrate dev --name init
```

5) Run services
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`

## Notes
- Prisma models live in `backend/prisma/schema.prisma`.
- `backend/src/models` provides a shared Prisma client.
- Live seat updates use the `/seats` Socket.io namespace.
- Update CORS origins in `backend/src/config/env.js` for production.

