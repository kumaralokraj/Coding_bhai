-- Coding Bhai - PostgreSQL Database Schema
-- Run this script to create all necessary tables

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  bio TEXT,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Problems Table
CREATE TABLE IF NOT EXISTS problems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  difficulty VARCHAR(50),
  constraints TEXT,
  examples JSONB,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'active',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Test Cases Table
CREATE TABLE IF NOT EXISTS test_cases (
  id SERIAL PRIMARY KEY,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  output TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  execution_time FLOAT,
  memory_usage INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Contests Table
CREATE TABLE IF NOT EXISTS contests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'upcoming',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Contest Problems Table
CREATE TABLE IF NOT EXISTS contest_problems (
  id SERIAL PRIMARY KEY,
  contest_id INTEGER REFERENCES contests(id) ON DELETE CASCADE,
  problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 100,
  sequence INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Contest Participants Table
CREATE TABLE IF NOT EXISTS contest_participants (
  id SERIAL PRIMARY KEY,
  contest_id INTEGER REFERENCES contests(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  rank INTEGER,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(contest_id, user_id)
);

-- Create Executions Table
CREATE TABLE IF NOT EXISTS executions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  language VARCHAR(50),
  input TEXT,
  output TEXT,
  error TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  execution_time FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Interviews Table
CREATE TABLE IF NOT EXISTS interviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  difficulty VARCHAR(50),
  status VARCHAR(50) DEFAULT 'in_progress',
  notes TEXT,
  score INTEGER,
  answers JSONB,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Interview Questions Table
CREATE TABLE IF NOT EXISTS interview_questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  difficulty VARCHAR(50),
  topic VARCHAR(100),
  answer TEXT,
  hints JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create AI Interactions Table
CREATE TABLE IF NOT EXISTS ai_interactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  problem_id INTEGER REFERENCES problems(id) ON DELETE SET NULL,
  type VARCHAR(50),
  prompt TEXT,
  response TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Leaderboard Table (Cache)
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  problems_solved INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  ranking INTEGER,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_category ON problems(category);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_contests_status ON contests(status);
CREATE INDEX IF NOT EXISTS idx_contest_participants_user_id ON contest_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user_id ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_ranking ON leaderboard(ranking);

-- Insert Sample Data (Optional)

-- Sample Users
INSERT INTO users (email, name, password) VALUES
('admin@coding.com', 'Admin User', '$2a$10$example_hash_1'),
('user1@coding.com', 'User One', '$2a$10$example_hash_2'),
('user2@coding.com', 'User Two', '$2a$10$example_hash_3')
ON CONFLICT DO NOTHING;

-- Sample Problems
INSERT INTO problems (title, description, difficulty, category, constraints, created_by) VALUES
('Two Sum', 'Given an array of integers and a target, find two numbers that add up to target.', 'easy', 'arrays', '1 <= nums.length <= 10^4', 1),
('Palindrome Check', 'Check if a given string is a palindrome.', 'easy', 'strings', 'String length: 1-10^4', 1),
('Binary Tree Level Order Traversal', 'Return the level order traversal of a binary tree.', 'medium', 'trees', 'Tree nodes: 0-5000', 1)
ON CONFLICT DO NOTHING;

-- Sample Interview Questions
INSERT INTO interview_questions (question, difficulty, topic, answer) VALUES
('Explain the difference between pass by value and pass by reference.', 'easy', 'fundamentals', 'Pass by value creates a copy, pass by reference uses a pointer...'),
('What is time complexity and space complexity?', 'easy', 'algorithms', 'Time complexity measures algorithm speed, space complexity measures memory usage...'),
('How do you optimize a slow query in SQL?', 'medium', 'databases', 'Use indexes, analyze query plans, denormalize if needed...')
ON CONFLICT DO NOTHING;

-- Commit
COMMIT;

-- Verification Queries
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Problems', COUNT(*) FROM problems
UNION ALL
SELECT 'Test Cases', COUNT(*) FROM test_cases
UNION ALL
SELECT 'Submissions', COUNT(*) FROM submissions
UNION ALL
SELECT 'Contests', COUNT(*) FROM contests
UNION ALL
SELECT 'Interviews', COUNT(*) FROM interviews
UNION ALL
SELECT 'Interview Questions', COUNT(*) FROM interview_questions;
