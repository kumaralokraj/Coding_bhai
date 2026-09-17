# 🚀 Client Quick Start Guide

## 🎯 In 5 Minutes

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Create .env File
```
VITE_API_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📁 Project Structure (Simplified)

```
src/
├── services/        # API calls (authService, problemService, etc)
├── hooks/          # useAuth, useFetch, useDebounce
├── utils/          # validators, formatters, helpers
├── context/        # AuthContext, ThemeContext, InterviewContext
├── pages/          # Home, Problems, Contests, etc
├── components/     # Reusable components
├── layouts/        # MainLayout, AuthLayout
└── tests/          # Unit tests
```

---

## 🔑 Key Files to Know

### Services
- `services/api.js` - Base API client with token management
- `services/authService.js` - Login, register, logout
- `services/problemService.js` - Problems CRUD
- `services/executionService.js` - Code execution
- `services/contestService.js` - Contests
- `services/interviewService.js` - Interview questions
- `services/leaderboardService.js` - Rankings

### Utilities
- `utils/validators.js` - Form validation
- `utils/formatters.js` - Date, number, text formatting
- `utils/helpers.js` - Debounce, throttle, copy, download, etc

### Hooks
- `hooks/useAuth.js` - Get auth state (user, isAuthenticated, login, logout)
- `hooks/useFetch.js` - Fetch data from API
- `hooks/useDebounce.js` - Debounce & throttle

### Context
- `context/AuthContext.jsx` - Global authentication state
- `context/ThemeContext.jsx` - Dark/light mode
- `context/InterviewContext.jsx` - Interview session state

---

## 💡 Common Tasks

### Get Current User
```javascript
import { useAuth } from './hooks/useAuth.js';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Redirect to="/login" />;
  
  return <h1>Welcome {user.name}!</h1>;
}
```

### Fetch Problems
```javascript
import { useState, useEffect } from 'react';
import problemService from './services/problemService.js';

function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await problemService.getAllProblems(1, 10);
      setProblems(response.problems);
      setLoading(false);
    };
    fetchData();
  }, []);
  
  return (
    <div>
      {loading ? <p>Loading...</p> : <ProblemeList problems={problems} />}
    </div>
  );
}
```

### Validate Form
```javascript
import { validateAuthForm } from './utils/validators.js';

const { isValid, errors } = validateAuthForm(email, password);
if (!isValid) {
  // Show errors
}
```

### Format Date
```javascript
import { formatDate, getDifficultyColor } from './utils/formatters.js';

<p>{formatDate(new Date())}</p>
<span className={getDifficultyColor('easy')}>Easy</span>
```

### Debounce Search
```javascript
import { useDebounce } from './hooks/useDebounce.js';

const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  // API call with debouncedSearch
}, [debouncedSearch]);
```

---

## 🔐 Authentication Setup

### Flow
1. User visits `/login` or `/signup`
2. Enters credentials
3. `authService.login()` or `authService.register()` called
4. JWT token received and stored
5. Redirected to dashboard
6. All API calls automatically include token

### Check if Logged In
```javascript
const { isAuthenticated } = useAuth();
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
```

---

## 🧪 Running Tests

```bash
npm test              # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

Test files are in `src/tests/`:
- `auth.test.js` - Auth service tests
- `problem.test.js` - Problem service tests
- `validators.test.js` - Validation function tests
- `formatters.test.js` - Format function tests
- `helpers.test.js` - Helper function tests

---

## 🎨 Styling

Uses **Tailwind CSS**. Classes available:

```jsx
// Colors
<div className="bg-blue-600 text-white">Text</div>

// Spacing
<div className="p-4 m-2 mx-auto">Content</div>

// Responsive
<div className="hidden md:block">Only on medium+ screens</div>

// Dark mode
<div className="dark:bg-gray-800 dark:text-white">Dark mode support</div>

// Hover & transitions
<button className="hover:bg-blue-700 transition duration-200">Button</button>
```

---

## 🔌 API Endpoints Used

### Auth
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/profile` - Get profile

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get problem details
- `GET /api/problems/:id/test-cases` - Get test cases

### Submissions
- `POST /api/submissions` - Submit solution
- `GET /api/submissions` - Get user submissions

### Contests
- `GET /api/contests` - Get all contests
- `GET /api/contests/:id` - Get contest details
- `POST /api/contests/:id/join` - Join contest

### Others
- `/api/leaderboard` - Rankings
- `/api/users/me` - Current user
- `/api/ai/*` - AI features
- `/api/interviews/*` - Interview prep

---

## 🐛 Common Issues & Fixes

### "API not working"
- Check backend is running on `http://localhost:5000`
- Check `.env` has `VITE_API_URL=http://localhost:5000/api`
- Check browser console for errors
- Check Network tab in DevTools

### "useAuth() hook returns undefined"
- Make sure `<AuthProvider>` wraps your app in `main.jsx`
- Import from correct path: `./hooks/useAuth.js` or `./context/AuthContext.jsx`

### "Services not working"
- Check if backend API routes are implemented
- Make sure auth token is sent with protected routes
- Check for CORS issues in browser console

### "Styles not appearing"
- Rebuild Tailwind: `npm run dev`
- Check class names are correct
- Check `tailwind.config.js` has correct content paths

---

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
# Creates optimized build in ./dist folder
```

### Preview Build Locally
```bash
npm run preview
```

### Deploy to Netlify
```bash
npm run build
# Drag & drop dist folder to Netlify
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

---

## ✨ Features Implemented

✅ Authentication (login, signup, logout)
✅ Problem listing with filters
✅ Global leaderboard
✅ Dashboard with stats
✅ Services for all API endpoints
✅ Form validators
✅ Data formatters
✅ Custom hooks
✅ Context API for state
✅ Responsive design
✅ Dark mode support
✅ Unit tests
✅ Error handling

---

## 🎯 Next Features to Implement

- [ ] Code editor component
- [ ] Problem details page with editor
- [ ] Contest participation
- [ ] Interview session UI
- [ ] User profile page
- [ ] Real-time notifications
- [ ] Code syntax highlighting
- [ ] Timer for contests

---

## 📚 Resources

- React: https://react.dev
- React Router: https://reactrouter.com
- Tailwind: https://tailwindcss.com
- Vite: https://vitejs.dev
- API Docs: See [API_DOCUMENTATION.md](../server/API_DOCUMENTATION.md)

---

## 🚀 You're All Set!

The client is fully set up with:
- ✅ All services connected to backend
- ✅ Form validators and data formatters
- ✅ Authentication with JWT
- ✅ Custom hooks and context
- ✅ Responsive UI with Tailwind
- ✅ Unit tests
- ✅ Error handling

Start building components and pages! 💪

Happy coding! 🎉
