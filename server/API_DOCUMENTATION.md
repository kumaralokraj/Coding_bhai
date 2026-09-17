# Coding Bhai Server - Complete API Documentation

## 🚀 Server Setup & Installation

### Prerequisites
- Node.js 14+ installed
- PostgreSQL 12+ database running locally
- npm or yarn package manager

### Installation Steps

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create/update `.env` file with:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=Alok@123
   DB_NAME=coding_bhai
   PORT=5000
   JWT_SECRET=my_super_secret_key_12345
   NODE_ENV=development
   ```

4. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE coding_bhai;
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

---

## 📚 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

---

## 🔐 Authentication Routes `/api/auth`

### Register User
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

### Login User
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

### Logout (Protected)
```
POST /api/auth/logout
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Logout successful"
}
```

### Refresh Token (Protected)
```
POST /api/auth/refresh-token
Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Token refreshed",
  "token": "new_jwt_token"
}
```

### Get Profile (Protected)
```
GET /api/auth/profile
Authorization: Bearer {token}

Response:
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## 📋 Problems Routes `/api/problems`

### Get All Problems
```
GET /api/problems?page=1&limit=10&difficulty=easy&status=active

Response:
{
  "success": true,
  "problems": [...]
}
```

### Get Problem by ID
```
GET /api/problems/:id

Response:
{
  "success": true,
  "problem": {
    "id": 1,
    "title": "Two Sum",
    "description": "...",
    "difficulty": "easy",
    "constraints": "...",
    "examples": "...",
    "category": "arrays"
  }
}
```

### Get Test Cases for Problem
```
GET /api/problems/:id/test-cases

Response:
{
  "success": true,
  "testCases": [...]
}
```

### Create Problem (Protected)
```
POST /api/problems
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "title": "Two Sum",
  "description": "Given an array of integers...",
  "difficulty": "easy",
  "constraints": "...",
  "examples": "...",
  "category": "arrays"
}
```

### Update Problem (Protected)
```
PUT /api/problems/:id
Authorization: Bearer {token}
Content-Type: application/json

Body: {problem_fields}
```

### Delete Problem (Protected)
```
DELETE /api/problems/:id
Authorization: Bearer {token}
```

### Add Test Case (Protected)
```
POST /api/problems/:id/test-cases
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "input": "[2,7,11,15], target = 9",
  "output": "[0,1]"
}
```

---

## 📤 Submissions Routes `/api/submissions`

### Submit Solution (Protected)
```
POST /api/submissions
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "problemId": 1,
  "code": "function twoSum(nums, target) {...}",
  "language": "javascript"
}
```

### Get User Submissions (Protected)
```
GET /api/submissions?page=1&limit=10
Authorization: Bearer {token}
```

### Get Submission by ID (Protected)
```
GET /api/submissions/:id
Authorization: Bearer {token}
```

### Get Problem Submissions (Protected)
```
GET /api/submissions/problem/:problemId
Authorization: Bearer {token}
```

### Update Submission (Protected)
```
PUT /api/submissions/:id
Authorization: Bearer {token}
```

### Delete Submission (Protected)
```
DELETE /api/submissions/:id
Authorization: Bearer {token}
```

---

## 🏆 Contests Routes `/api/contests`

### Get All Contests
```
GET /api/contests?page=1&limit=10&status=active
```

### Get Contest by ID
```
GET /api/contests/:id
```

### Get Contest Problems
```
GET /api/contests/:id/problems
```

### Get Contest Leaderboard
```
GET /api/contests/:id/leaderboard
```

### Create Contest (Protected)
```
POST /api/contests
Authorization: Bearer {token}
```

### Update Contest (Protected)
```
PUT /api/contests/:id
Authorization: Bearer {token}
```

### Delete Contest (Protected)
```
DELETE /api/contests/:id
Authorization: Bearer {token}
```

### Join Contest (Protected)
```
POST /api/contests/:id/join
Authorization: Bearer {token}
```

### Leave Contest (Protected)
```
POST /api/contests/:id/leave
Authorization: Bearer {token}
```

---

## ⚡ Code Execution Routes `/api/execute`

### Run Code (Protected)
```
POST /api/execute/run
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "code": "console.log('Hello World')",
  "language": "javascript",
  "input": ""
}
```

### Submit Code (Protected)
```
POST /api/execute/submit
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "problemId": 1,
  "code": "...",
  "language": "javascript"
}
```

### Get Execution Status
```
GET /api/execute/status/:executionId
```

### Get Execution History (Protected)
```
GET /api/execute/history
Authorization: Bearer {token}
```

### Get Execution by ID (Protected)
```
GET /api/execute/:id
Authorization: Bearer {token}
```

---

## 🎓 Interviews Routes `/api/interviews`

### Get Interview Questions
```
GET /api/interviews/questions?difficulty=easy&topic=arrays&page=1&limit=10
```

### Get Question by ID
```
GET /api/interviews/questions/:id
```

### Start Interview (Protected)
```
POST /api/interviews
Authorization: Bearer {token}
Body: { "difficulty": "medium" }
```

### Get Interview Session (Protected)
```
GET /api/interviews/:id
Authorization: Bearer {token}
```

### Update Interview Session (Protected)
```
PUT /api/interviews/:id
Authorization: Bearer {token}
```

### Submit Interview (Protected)
```
POST /api/interviews/:id/submit
Authorization: Bearer {token}
Body: { "answers": [...] }
```

### Get User Interviews (Protected)
```
GET /api/interviews/my-sessions
Authorization: Bearer {token}
```

---

## 🤖 AI Routes `/api/ai`

All AI routes require authentication.

### Generate Hint (Protected)
```
POST /api/ai/generate-hint
Authorization: Bearer {token}
Body: { "problemId": 1 }
```

### Solve Problem (Protected)
```
POST /api/ai/solve-problem
Authorization: Bearer {token}
Body: { "problemId": 1 }
```

### Analyze Code (Protected)
```
POST /api/ai/analyze-code
Authorization: Bearer {token}
Body: { "code": "...", "language": "javascript" }
```

### Generate Explanation (Protected)
```
POST /api/ai/generate-explanation
Authorization: Bearer {token}
Body: { "problemId": 1 }
```

### Get Code Suggestions (Protected)
```
GET /api/ai/suggestions/:problemId
Authorization: Bearer {token}
```

---

## 📊 Leaderboard Routes `/api/leaderboard`

### Get Global Leaderboard
```
GET /api/leaderboard?page=1&limit=50
```

### Get Contest Leaderboard
```
GET /api/leaderboard/contest/:contestId
```

### Get User Rank
```
GET /api/leaderboard/user/:userId
```

### Get User Stats (Protected)
```
GET /api/leaderboard/stats
Authorization: Bearer {token}
```

### Refresh Leaderboard (Protected)
```
POST /api/leaderboard/refresh
Authorization: Bearer {token}
```

---

## 👤 User Routes `/api/users`

### Get User Profile
```
GET /api/users/:id
```

### Get User Submissions
```
GET /api/users/:id/submissions?page=1&limit=10
```

### Get User Statistics
```
GET /api/users/:id/statistics
```

### Update Profile (Protected)
```
PUT /api/users/profile
Authorization: Bearer {token}
Body: { "name": "John", "bio": "..." }
```

### Change Password (Protected)
```
PUT /api/users/password
Authorization: Bearer {token}
Body: {
  "oldPassword": "old123",
  "newPassword": "new123"
}
```

### Update Preferences (Protected)
```
PUT /api/users/preferences
Authorization: Bearer {token}
Body: {
  "theme": "dark",
  "notifications": true,
  "language": "en"
}
```

### Get Current User (Protected)
```
GET /api/users/me
Authorization: Bearer {token}
```

### Delete Account (Protected)
```
DELETE /api/users/account
Authorization: Bearer {token}
```

---

## 🗄️ Database Schema

You need to create these tables in PostgreSQL:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  bio TEXT,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Problems table
CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(50),
  constraints TEXT,
  examples JSONB,
  category VARCHAR(100),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Cases table
CREATE TABLE test_cases (
  id SERIAL PRIMARY KEY,
  problem_id INTEGER REFERENCES problems(id),
  input TEXT NOT NULL,
  output TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  problem_id INTEGER REFERENCES problems(id),
  user_id INTEGER REFERENCES users(id),
  code TEXT NOT NULL,
  language VARCHAR(50),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contests table
CREATE TABLE contests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status VARCHAR(50),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contest Problems table
CREATE TABLE contest_problems (
  id SERIAL PRIMARY KEY,
  contest_id INTEGER REFERENCES contests(id),
  problem_id INTEGER REFERENCES problems(id),
  points INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contest Participants table
CREATE TABLE contest_participants (
  id SERIAL PRIMARY KEY,
  contest_id INTEGER REFERENCES contests(id),
  user_id INTEGER REFERENCES users(id),
  score INTEGER DEFAULT 0,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Executions table
CREATE TABLE executions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  code TEXT NOT NULL,
  language VARCHAR(50),
  input TEXT,
  output TEXT,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interviews table
CREATE TABLE interviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  difficulty VARCHAR(50),
  status VARCHAR(50),
  notes TEXT,
  score INTEGER,
  answers JSONB,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interview Questions table
CREATE TABLE interview_questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  difficulty VARCHAR(50),
  topic VARCHAR(100),
  answer TEXT,
  hints JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Interactions table
CREATE TABLE ai_interactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  problem_id INTEGER REFERENCES problems(id),
  type VARCHAR(50),
  response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaderboard table
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  problems_solved INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Rate Limiting:** express-rate-limit
- **CORS:** cors
- **Environment:** dotenv

---

## 📝 File Structure

```
server/
├── server.js              # Main server entry point
├── app.js                 # Express app configuration (currently empty)
├── package.json           # Dependencies
├── .env                   # Environment variables
├── src/
│   ├── config/
│   │   └── db.js         # Database configuration
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   ├── problemController.js
│   │   ├── submissionController.js
│   │   ├── contestController.js
│   │   ├── executionController.js
│   │   ├── interviewController.js
│   │   ├── aiController.js
│   │   ├── leaderboardController.js
│   │   └── userController.js
│   ├── routes/            # API routes
│   │   ├── authRoutes.js
│   │   ├── problemRoutes.js
│   │   ├── submissionRoutes.js
│   │   ├── contestRoutes.js
│   │   ├── executionRoutes.js
│   │   ├── interviewRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/        # Middleware functions
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   ├── rateLimitMiddleware.js
│   │   └── validationMiddleware.js
│   └── models/            # Database models (optional)
└── tests/                 # Test files
```

---

## ⚠️ Important Notes

1. **JWT Authentication:** Include `Authorization: Bearer {token}` header for protected routes
2. **CORS:** Configured to allow requests from all origins (update for production)
3. **Rate Limiting:** 100 requests per 15 minutes per IP
4. **Database Connection:** Pool automatically connects on server startup
5. **Error Handling:** Centralized error middleware handles all exceptions

---

## 🚀 Next Steps

1. ✅ Set up database tables using the SQL schema above
2. ✅ Update `.env` with your actual database credentials
3. ✅ Run `npm run dev` to start the development server
4. 🔄 Integrate actual code execution service (Docker/sandbox)
5. 🔄 Implement AI service integration (OpenAI/Gemini API)
6. 🔄 Add validation and detailed error handling
7. 🔄 Write comprehensive tests
8. 🔄 Deploy to production

---

## 📞 Support

For issues or questions, please check the error logs and ensure:
- Database is running and accessible
- `.env` file has correct credentials
- All dependencies are installed
- Port 5000 is not already in use
