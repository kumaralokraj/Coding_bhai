# 🚀 Quick Start Guide - Coding Bhai Server

## Prerequisite Setup (One-time)

### Step 1: Create PostgreSQL Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE coding_bhai;

# Exit psql
\q
```

### Step 2: Create Database Tables
Copy and run all SQL from [server/SQL_SCHEMA.sql](./SQL_SCHEMA.md) in your PostgreSQL client.

Or use psql:
```bash
psql -U postgres -d coding_bhai -f schema.sql
```

---

## Running the Server

### Option 1: Development Mode (with auto-reload)
```bash
cd server
npm run dev
```

### Option 2: Production Mode
```bash
cd server
npm start
```

Server will start on `http://localhost:5000`

---

## Testing the API

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
Save the token from response.

### 4. Access Protected Route
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Environment Variables

Located in `.env`:
- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_USER`: Database user (default: postgres)
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name (default: coding_bhai)
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT tokens

---

## API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/health | No | Server health check |
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login user |
| GET | /api/problems | No | Get all problems |
| POST | /api/problems | Yes | Create new problem |
| POST | /api/submissions | Yes | Submit solution |
| GET | /api/leaderboard | No | View rankings |
| GET | /api/contests | No | Get all contests |
| POST | /api/interviews | Yes | Start interview |
| GET | /api/users/me | Yes | Get current user |

For complete documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## Common Issues

### Issue: "Cannot connect to database"
- ✅ Ensure PostgreSQL is running
- ✅ Check DB credentials in `.env`
- ✅ Verify database exists: `createdb coding_bhai`

### Issue: "Port 5000 already in use"
- Change PORT in `.env` or kill process using port

### Issue: "Module not found"
- Run `npm install` in server directory

### Issue: JWT errors
- Update `JWT_SECRET` in `.env`
- Clear any old tokens

---

## Next: Connect Frontend

Update client API service to use:
```
http://localhost:5000/api
```

Then in client:
```bash
cd client
npm run dev
```

---

## 📚 Documentation
- Full API docs: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Database schema: See [SQL_SCHEMA.md](./SQL_SCHEMA.md)
- Controller details: Check individual files in `src/controllers/`

---

Happy coding! 🎉
