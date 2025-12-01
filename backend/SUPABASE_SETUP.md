# ✅ Supabase Setup Instructions

## What I've Fixed

1. ✅ **Prisma Schema** - Changed to use environment variables:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

2. ✅ **Prisma Client** - Generated successfully

3. ✅ **Environment File** - Your `.env` file has the Supabase credentials

---

## Next Steps - Run These Commands

### 1. Test Database Connection
```powershell
npx prisma db pull
```
This will test if Prisma can connect to your Supabase database.

### 2. Run Migrations
```powershell
npx prisma migrate dev --name init
```
This creates all your tables (User, Bus, Route, Seat, Booking).

### 3. Seed Database
```powershell
npm run seed
```
This adds sample data (admin user, buses, routes, seats).

### 4. Verify with Prisma Studio
```powershell
npx prisma studio
```
Opens a GUI at http://localhost:5555 to view your data.

---

## If Migration Fails

### Check Supabase Connection

1. Go to your Supabase dashboard
2. Settings → Database → Connection String
3. Make sure the password in your `.env` matches

### Alternative: Use Supabase SQL Editor

If migrations keep failing, you can run the SQL directly in Supabase:

1. Go to Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Run this SQL:

```sql
-- Create User table
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Route table
CREATE TABLE "Route" (
  "id" TEXT PRIMARY KEY,
  "origin" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "departure" TIMESTAMP NOT NULL,
  "arrival" TIMESTAMP NOT NULL
);

-- Create Bus table
CREATE TABLE "Bus" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "number" TEXT UNIQUE NOT NULL,
  "routeId" TEXT NOT NULL REFERENCES "Route"("id"),
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Seat table
CREATE TABLE "Seat" (
  "id" TEXT PRIMARY KEY,
  "seatNumber" TEXT NOT NULL,
  "busId" TEXT NOT NULL REFERENCES "Bus"("id"),
  "isBooked" BOOLEAN NOT NULL DEFAULT false,
  UNIQUE("busId", "seatNumber")
);

-- Create Booking table
CREATE TABLE "Booking" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id"),
  "busId" TEXT NOT NULL REFERENCES "Bus"("id"),
  "seatId" TEXT UNIQUE NOT NULL REFERENCES "Seat"("id"),
  "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Then run:
```powershell
npx prisma db pull
npx prisma generate
npm run seed
```

---

## ✅ Success Indicators

You'll know everything works when:
1. Migration completes without errors
2. Seed script runs successfully
3. Prisma Studio shows your data
4. You can see tables in Supabase Dashboard → Table Editor

---

## 🚀 Start Backend Server

Once migrations are done:
```powershell
npm run dev
```

You should see:
```
✅ PostgreSQL connected successfully
API listening on http://localhost:5000
```

---

## 📝 Your Current .env Configuration

Your `.env` file is configured with:
- ✅ Supabase PostgreSQL (pooler connection)
- ✅ Direct URL for migrations
- ⚠️ Redis URL (you still need to install Redis)

For Redis, run:
```powershell
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

Or skip Redis for now - your app will work without it (Socket.io will fall back to memory adapter).
