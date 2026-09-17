# 🎓 Coding Bhai Client - Complete Documentation

## 📋 Project Overview

The Coding Bhai client is a React-based frontend application for a competitive coding platform. It includes features for problem solving, contests, interviews, and learning.

## 🏗️ Project Structure

```
client/
├── src/
│   ├── assets/              # Images, icons, media files
│   ├── components/          # Reusable React components
│   │   ├── ai/             # AI-related components
│   │   ├── common/         # Common components (Button, Card, etc)
│   │   ├── contest/        # Contest components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── editor/         # Code editor component
│   │   ├── interview/      # Interview components
│   │   ├── landing/        # Landing page components
│   │   ├── layout/         # Layout components (Sidebar, Header)
│   │   └── problems/       # Problem components
│   ├── context/            # React Context (Auth, Theme, Interview)
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── InterviewContext.jsx
│   ├── data/               # Static data and constants
│   │   ├── interviewQuestions.js
│   │   ├── navigation.js
│   │   └── problems.js
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.js      # Authentication hook
│   │   ├── useDebounce.js  # Debounce & Throttle hooks
│   │   └── useFetch.js     # Data fetching hook
│   ├── layouts/            # Page layouts
│   │   ├── MainLayout.jsx  # Main layout with sidebar
│   │   └── AuthLayout.jsx  # Auth pages layout
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Settings.jsx
│   │   ├── auth/           # Auth pages
│   │   ├── contests/       # Contest pages
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── interview/      # Interview pages
│   │   ├── problems/       # Problem pages
│   │   ├── profile/        # Profile pages
│   │   └── learn/          # Learning pages
│   ├── services/           # API services
│   │   ├── api.js          # API client
│   │   ├── authService.js
│   │   ├── problemService.js
│   │   ├── submissionService.js (executionService.js)
│   │   ├── contestService.js
│   │   ├── interviewService.js
│   │   ├── aiService.js
│   │   ├── leaderboardService.js
│   │   └── userService.js
│   ├── tests/              # Unit and integration tests
│   │   ├── auth.test.js
│   │   ├── problem.test.js
│   │   ├── validators.test.js
│   │   ├── formatters.test.js
│   │   └── helpers.test.js
│   ├── utils/              # Utility functions
│   │   ├── validators.js   # Form validation functions
│   │   ├── formatters.js   # Data formatting functions
│   │   └── helpers.js      # Helper utilities
│   ├── App.jsx             # Main App component
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point
├── public/                 # Static files
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
└── .env.example            # Environment variables template
```

## 🚀 Getting Started

### Installation

```bash
cd client
npm install
```

### Environment Setup

Create `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

### Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 📦 Services

### API Client (`services/api.js`)

Base API client with automatic token handling:

```javascript
import api from './services/api.js';

// Automatic token management
api.setToken(token);
api.getToken();
api.clearToken();

// HTTP methods
await api.get('/endpoint');
await api.post('/endpoint', data);
await api.put('/endpoint', data);
await api.delete('/endpoint');
await api.patch('/endpoint', data);
```

### Auth Service (`services/authService.js`)

```javascript
import authService from './services/authService.js';

await authService.register(email, password, name);
await authService.login(email, password);
await authService.logout();
await authService.getProfile();
await authService.refreshToken();
authService.isAuthenticated();
```

### Problem Service (`services/problemService.js`)

```javascript
import problemService from './services/problemService.js';

await problemService.getAllProblems(page, limit, difficulty, status);
await problemService.getProblemById(id);
await problemService.getTestCases(problemId);
await problemService.createProblem(data);
await problemService.updateProblem(id, data);
await problemService.deleteProblem(id);
await problemService.addTestCase(problemId, input, output);
```

### Execution Service (`services/executionService.js`)

```javascript
import executionService from './services/executionService.js';

await executionService.runCode(code, language, input);
await executionService.submitCode(problemId, code, language);
await executionService.getExecutionStatus(executionId);
await executionService.getExecutionHistory(page, limit);
await executionService.getExecutionById(id);
```

### Contest Service (`services/contestService.js`)

```javascript
import contestService from './services/contestService.js';

await contestService.getAllContests(page, limit, status);
await contestService.getContestById(id);
await contestService.getContestProblems(contestId);
await contestService.getContestLeaderboard(contestId);
await contestService.createContest(data);
await contestService.updateContest(id, data);
await contestService.deleteContest(id);
await contestService.joinContest(contestId);
await contestService.leaveContest(contestId);
```

### Interview Service (`services/interviewService.js`)

```javascript
import interviewService from './services/interviewService.js';

await interviewService.getInterviewQuestions(difficulty, topic, page, limit);
await interviewService.getQuestionById(id);
await interviewService.startInterview(difficulty);
await interviewService.getInterviewSession(id);
await interviewService.updateInterviewSession(id, data);
await interviewService.submitInterview(id, answers);
await interviewService.getUserInterviews(page, limit);
```

### AI Service (`services/aiService.js`)

```javascript
import aiService from './services/aiService.js';

await aiService.generateHint(problemId);
await aiService.solveProblem(problemId);
await aiService.analyzeCode(code, language);
await aiService.generateExplanation(problemId);
await aiService.getCodeSuggestions(problemId);
```

### Leaderboard Service (`services/leaderboardService.js`)

```javascript
import leaderboardService from './services/leaderboardService.js';

await leaderboardService.getGlobalLeaderboard(page, limit);
await leaderboardService.getContestLeaderboard(contestId);
await leaderboardService.getUserRank(userId);
await leaderboardService.getUserStats();
await leaderboardService.refreshLeaderboard();
```

### User Service (`services/userService.js`)

```javascript
import userService from './services/userService.js';

await userService.getUserProfile(userId);
await userService.getUserSubmissions(userId, page, limit);
await userService.getUserStatistics(userId);
await userService.updateProfile(name, bio);
await userService.changePassword(oldPassword, newPassword);
await userService.updatePreferences(preferences);
await userService.getCurrentUser();
await userService.deleteAccount();
```

---

## 🪝 Hooks

### useAuth Hook

```javascript
import { useAuth } from './hooks/useAuth.js';

const { 
  user,                    // Current user object
  isLoading,              // Loading state
  error,                  // Error message
  isAuthenticated,        // Authentication status
  register,               // Register function
  login,                  // Login function
  logout,                 // Logout function
  getProfile,             // Get profile function
  refreshToken            // Refresh token function
} = useAuth();
```

### useFetch Hook

```javascript
const { data, loading, error } = useFetch(url, options);
```

### useDebounce & useThrottle Hooks

```javascript
import { useDebounce, useThrottle } from './hooks/useDebounce.js';

const debouncedValue = useDebounce(value, 300);
const throttledValue = useThrottle(value, 1000);
```

---

## ✅ Validators

Located in `utils/validators.js`:

```javascript
import {
  validateEmail,
  validatePassword,
  validateCode,
  validateDifficulty,
  validateLanguage,
  validateCategory,
  validateAuthForm,
  validateProblemForm,
  validateSubmissionForm,
} from './utils/validators.js';

// Individual validators return boolean
validateEmail('test@example.com');       // true/false
validatePassword('password123');         // true/false
validateCode('console.log("hi")');      // true/false

// Form validators return object with isValid and errors
const result = validateAuthForm(email, password, name);
// { isValid: true/false, errors: { field: 'error message' } }
```

---

## 🎨 Formatters

Located in `utils/formatters.js`:

```javascript
import {
  formatDate,
  formatDateTime,
  formatExecutionTime,
  formatMemory,
  truncateText,
  getDifficultyColor,
  getDifficultyBadge,
  getStatusColor,
  formatNumber,
  getInitials,
  formatBytes,
  getContestStatus,
} from './utils/formatters.js';

formatDate(new Date());                  // "January 15, 2024"
formatDateTime(new Date());              // "January 15, 2024, 10:30:00 AM"
formatExecutionTime(1500);               // "1.50s"
truncateText('Long text...', 20);       // "Long text......"
getDifficultyColor('easy');              // "text-green-500"
getDifficultyBadge('hard');              // "bg-red-100 text-red-800"
getInitials('John Doe');                 // "JD"
formatNumber(1000000);                   // "1,000,000"
```

---

## 🔧 Helpers

Located in `utils/helpers.js`:

```javascript
import {
  debounce,
  throttle,
  deepClone,
  mergeObjects,
  generateId,
  sortBy,
  groupBy,
  unique,
  downloadFile,
  copyToClipboard,
  getQueryParam,
  setQueryParam,
  retry,
} from './utils/helpers.js';

const debouncedFunc = debounce(func, 300);
const throttledFunc = throttle(func, 1000);
const cloned = deepClone(object);
const merged = mergeObjects(obj1, obj2);
const id = generateId();
const sorted = sortBy(array, 'key', 'asc');
const grouped = groupBy(array, 'key');
const unique_array = unique(array, 'key');
downloadFile(content, 'file.txt');
await copyToClipboard(text);
const param = getQueryParam('page');
setQueryParam('page', 2);
await retry(asyncFunc, retries, delay);
```

---

## 📊 Context API

### AuthContext

Provides authentication state and methods across the app:

```javascript
import { useAuth } from './hooks/useAuth.js';

const { user, isAuthenticated, login, logout, register } = useAuth();
```

### ThemeContext

Manages light/dark theme:

```javascript
import { useTheme } from './context/ThemeContext.jsx';

const { theme, toggleTheme } = useTheme();
```

### InterviewContext

Manages interview session state:

```javascript
import { useInterview } from './context/InterviewContext.jsx';

const { 
  currentInterview,
  currentQuestionIndex,
  answers,
  startInterview,
  updateCurrentAnswer,
  nextQuestion,
  previousQuestion,
  endInterview
} = useInterview();
```

---

## 🧪 Testing

Test files are located in `src/tests/` directory:

- `auth.test.js` - Authentication service tests
- `problem.test.js` - Problem service tests
- `validators.test.js` - Validator function tests
- `formatters.test.js` - Formatter function tests
- `helpers.test.js` - Helper function tests

### Running Tests

Tests can be run with Jest or Vitest (configure in package.json):

```bash
npm test
npm run test:coverage
```

### Test Example

```javascript
describe("Auth Service Tests", () => {
  test("should successfully login", async () => {
    const response = await authService.login("test@example.com", "password");
    expect(response.success).toBe(true);
    expect(response.token).toBeDefined();
  });
});
```

---

## 🎯 Key Components to Implement

1. **Code Editor Component** - Syntax highlighting, code execution
2. **Problem Details Page** - Display problem with editor and test cases
3. **Contest Components** - Contest list, scoreboard, countdown timer
4. **Interview Session Component** - Question display, timer, submit
5. **Dashboard Widgets** - Stats, recent activity, quick actions

---

## 🔐 Authentication Flow

1. User signs up/logs in via `/signup` or `/login` pages
2. JWT token is stored in localStorage
3. Token automatically included in API requests via `api.js`
4. Protected routes check `isAuthenticated` from `useAuth()`
5. Token refresh on 401 response

---

## 🌐 API Integration

### Connecting to Backend

All API calls go through the centralized `api.js` client:

```javascript
// Services use api.js internally
import api from './services/api.js';

// Example in a service
export const problemService = {
  async getAllProblems() {
    return await api.get('/problems');
  }
};
```

---

## 📱 Responsive Design

Uses Tailwind CSS for responsive design:

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Dark mode support with `dark:` classes

---

## 🚨 Error Handling

### Try-Catch Pattern

```javascript
try {
  const response = await authService.login(email, password);
  // Handle success
} catch (error) {
  setError(error.message);
  // Handle error
}
```

### Global Error Handling

Implement error boundary component for unhandled errors:

```javascript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 🔄 State Management

### Local State (useState)

For component-specific state:

```javascript
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});
```

### Context API

For global state (Auth, Theme, Interview):

```javascript
const { user, isAuthenticated } = useAuth();
const { theme, toggleTheme } = useTheme();
```

---

## 📡 Deployment

### Netlify

```bash
npm run build
# Deploy the dist folder to Netlify
```

### Vercel

```bash
vercel
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 🎨 Styling

### Tailwind CSS

Already configured. Use utility classes:

```jsx
<div className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition">
  Button
</div>
```

---

## 🐛 Debugging

### Browser DevTools

1. React DevTools extension for component inspection
2. Redux DevTools (if using Redux in future)
3. Network tab for API calls

### Console Logging

```javascript
console.log('Debug:', variable);
console.error('Error:', error);
```

---

## 📚 Useful Resources

- React Docs: https://react.dev
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

---

## ✨ Next Steps

1. Create reusable UI components (Button, Card, Modal, etc)
2. Implement code editor with syntax highlighting
3. Add loading skeletons for better UX
4. Implement real-time notifications
5. Add PWA support
6. Implement offline mode
7. Add analytics
8. Optimize bundle size

---

## 📞 Support

For issues or questions, check:
- Browser console for errors
- Network tab for API issues
- Component props and state
- React DevTools for component tree

Good coding! 🚀
