# Tradelingo 

A Duolingo-style financial education platform that teaches users about trading, investing, and financial literacy through interactive lessons and quizzes.

## Features 

- **4 Comprehensive Modules** with 52+ lessons covering:
  - **Module 1: Trading** (15 lessons) - Stock market fundamentals, technical analysis, risk management
  - **Module 2: Retirement Planning** (12 lessons) - 401(k), IRAs, Social Security, tax strategies
  - **Module 3: Cryptocurrencies** (15 lessons) - Blockchain, Bitcoin, Ethereum, DeFi, trading strategies
  - **Module 4: Brokers & Trading Platforms** (10 lessons) - Broker types, order execution, margin trading

- **Interactive Learning**
  - Module pretests to assess knowledge
  - Detailed lessons with practical examples
  - Quiz questions after each lesson
  - Progress tracking and streak system
  - Experience points (XP) and level progression

- **User Features**
  - Account registration and authentication
  - Daily activity streaks with reset logic
  - Module completion tracking
  - Automatic module unlocking on completion
  - Experience points system

## Tech Stack 🛠️

**Frontend:**
- React 18.3.1
- TypeScript 5.6.3
- Vite 6.4.1
- React Router for navigation
- Lucide React for icons

**Backend:**
- Express 5.2.1
- MongoDB 7.1.0 for data persistence
- Bcryptjs for password hashing
- CORS enabled for frontend communication

## Getting Started 

### Prerequisites
- Bun runtime (https://bun.sh)
- MongoDB Atlas account or local MongoDB instance
- Node.js 20+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GhostOf0days/Tradelingo.git
   cd Tradelingo
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with your MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_connection_string_here
   ```
   > ⚠️ **Important:** Keep your `.env` file private and never commit it to version control. Add it to `.gitignore`.

4. **Start the backend server**
   ```bash
   bun server/index.ts
   ```
   Server runs on `http://localhost:3000`

5. **Start the frontend dev server** (in another terminal)
   ```bash
   bun run dev
   ```
   Frontend runs on `http://localhost:5173` or `http://localhost:5174`

## Database 🗄️

**MongoDB** with automatic schema migrations:
- Users collection with authentication, progress tracking, and module completion data
- Automatic field addition for legacy users (lastUnlockedModuleId, progressByModuleId, completedModules)
- Secure password hashing with bcrypt

### User Schema
```typescript
{
  email: string,
  password: string (hashed),
  displayName: string,
  experiencePoints: number,
  lastUnlockedModuleId: number,
  progressByModuleId: { [moduleId]: { lessonCurrent: number } },
  streakDays: number,
  lastActivityDate: string (ISO date),
  completedModules: array,
  createdAt: Date
}
```

## API Endpoints 

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Progress & Learning
- `GET /api/progress/:email` - Get user's module progress
- `POST /api/complete-lesson` - Mark lesson as complete
- `POST /api/pass-module` - Pass module pretest and unlock next module
- `POST /api/complete-module` - Mark entire module as completed
- `POST /api/update-xp` - Update user's experience points

### User Data
- `GET /api/user/:email` - Get user's full profile
- `GET /api/completed-modules/:email` - Get list of completed modules
- `POST /api/update-streak` - Update daily streak

## Project Structure 

```
Tradelingo/
├── src/
│   ├── components/       # React components (Header, ModulesPage, etc.)
│   ├── pages/           # Page components (Lesson, Login, Register)
│   ├── contexts/        # React contexts (UserContext for auth)
│   ├── data/            # Module lesson content (module1.ts, module2.ts, etc.)
│   ├── App.tsx
│   └── index.tsx
├── server/
│   ├── index.ts         # Express server & API endpoints
│   └── db.ts            # Database utilities
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json
```

## Features Implemented 

- [x] User authentication with password hashing
- [x] 4 complete modules with comprehensive lessons
- [x] Module unlocking system (unlock next module on completion)
- [x] Pretest & post-lesson quizzes
- [x] Progress tracking per module
- [x] Daily streak system
- [x] Experience points system
- [x] Schema migration for legacy users
- [x] Responsive UI with CSS styling


## Database Migrations 

The backend automatically runs migrations on startup to ensure all users have required fields:
- Adds `lastUnlockedModuleId: 1` for legacy users
- Adds `progressByModuleId: {}` for legacy users
- Adds `completedModules: []` for legacy users

## License

Class project for educational purposes.
