// Root shell: wraps the app in auth state and client-side routing so every page
// can read the logged-in user and navigate without full reloads.
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Modules from './pages/Modules';
import Register from "./pages/register";
import Lesson from "./pages/Lesson"; 
import Login from "./pages/Login";
import PreTest from "./pages/pretest";
import Calculator from "./pages/Calculator";
import Explore from "./pages/Explore";
import Quizzes from "./pages/Quizzes";
import LightingRound from "./pages/LightingRound";
import ReviewModules from "./pages/ReviewModules";
import './App.css';

/** Declares every client route; API-backed pages assume Vite proxies `/api` in development. */
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="app">
          {/* Persistent chrome: nav, theme, streak, notifications */}
          <Header />
          <main className="app__main">
            <Routes>
              <Route path="/" element={<Modules />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/lesson/:id" element={<Lesson />} />
              <Route path="/pretest/:id" element={<PreTest />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/lightning-round" element={<LightingRound />} />
              <Route path="/completed-modules" element={<ReviewModules />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;