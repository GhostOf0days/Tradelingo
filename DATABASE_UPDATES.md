# Database Schema Updates

## Summary
Updated MongoDB user schema to better track user progress, streaks, and completed modules with persistence across devices and browser sessions.

## New Fields Added to User Collection

### 1. **streakDays** (Number)
- **Type**: Integer
- **Purpose**: Track the user's current daily streak count
- **Default**: 0
- **Logic**: Increments by 1 each day user completes a lesson, resets to 1 if 2+ days pass without activity

### 2. **lastActivityDate** (String - ISO Date)
- **Type**: String (YYYY-MM-DD format)
- **Purpose**: Track the last day user was active
- **Default**: null
- **Usage**: Used to calculate streak resets at midnight UTC

### 3. **completedModules** (Array)
- **Type**: Array of Objects
- **Purpose**: Store history of all completed modules
- **Default**: []
- **Structure**: 
```javascript
{
  moduleId: 1,
  title: "Stock Market Fundamentals",
  description: "Learn the basics of stocks...",
  completedDate: "2026-02-28",
  xpEarned: 500,
  score: 94,
  lessons: 15
}
```

## Updated Database Record Example

**Before:**
```javascript
{
  _id: ObjectId,
  email: "user@gmail.com",
  password: "$2b$10$...",
  displayName: "user",
  experiencePoints: 585,
  lastUnlockedModuleId: 2,
  progressByModuleId: {
    1: { lessonCurrent: 15 }
  },
  createdAt: ISODate("2026-02-23T19:22:31.736Z")
}
```

**After:**
```javascript
{
  _id: ObjectId,
  email: "user@gmail.com",
  password: "$2b$10$...",
  displayName: "user",
  experiencePoints: 585,
  lastUnlockedModuleId: 2,
  progressByModuleId: {
    1: { lessonCurrent: 15 }
  },
  streakDays: 5,
  lastActivityDate: "2026-03-02",
  completedModules: [
    {
      moduleId: 1,
      title: "Stock Market Fundamentals",
      description: "Learn the basics of stocks...",
      completedDate: "2026-02-28",
      xpEarned: 500,
      score: 94,
      lessons: 15
    }
  ],
  createdAt: ISODate("2026-02-23T19:22:31.736Z")
}
```

## New Backend Endpoints

### 1. **POST /api/update-streak**
- **Purpose**: Update user's streak and activity date
- **Request Body**: `{ email: string }`
- **Response**: `{ streakDays: number, lastActivityDate: string }`
- **Called**: When user completes a lesson or quiz

### 2. **GET /api/completed-modules/:email**
- **Purpose**: Fetch list of completed modules for a user
- **Response**: Array of completed modules
- **Used By**: ReviewModules page

### 3. **POST /api/complete-module**
- **Purpose**: Mark a module as completed and add to history
- **Request Body**: 
```javascript
{
  email: string,
  moduleId: number,
  title: string,
  score: number,
  xpEarned: number,
  lessonsTotal: number
}
```
- **Response**: `{ message: string, completedModules: array }`

### 4. **GET /api/user/:email** (New)
- **Purpose**: Fetch complete user profile including streak and completed modules
- **Response**: Full user object with all fields
- **Used By**: Initial login to sync all data

## Frontend Changes

### UserContext.tsx
- `updateStreak()` now syncs to backend via `/api/update-streak` endpoint
- Maintains localStorage as fallback for immediate UI updates
- Preserves local-first architecture with backend sync

### ReviewModules.tsx
- Now fetches real completed modules from backend
- Falls back to sample data if no backend data available
- Shows actual completion dates, scores, and XP earned

## Migration Notes

### For Existing Users
- New fields are optional and default to safe values
- Streak calculation happens on-demand when endpoint is called
- Sample completed modules show in UI until real data is created

### For New Registrations
- All new users automatically get new fields
- Streak starts at 0, increments with first lesson completion
- completedModules starts as empty array

## Testing Checklist

- [ ] User can update their streak via API
- [ ] Streak persists in database across sessions
- [ ] ReviewModules page fetches real completed modules
- [ ] Sample data shows if no real modules completed yet
- [ ] Streak resets correctly after 2+ days of inactivity
- [ ] XP rewards sync with streak updates

## Future Enhancements

1. **Leaderboard**: Use streakDays and totalXP to rank users
2. **Achievements**: Unlock badges based on streak milestones
3. **Statistics**: Per-module attempt history and performance tracking
4. **Progress Export**: Export user stats as CSV/PDF
5. **Streak Recovery**: Optional "revive" feature costing gems/currency
