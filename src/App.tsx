import { UserProvider } from './contexts/UserContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ModulesPage from './components/ModulesPage';
import Register from "./pages/register";
import Lesson from "./pages/Lesson"; 
import Login from "./pages/Login";
import PreTest from "./pages/pretest";
import './App.css';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="app__main">
            <Routes>
              <Route path="/" element={<ModulesPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/lesson/:id" element={<Lesson />} /> {/* <-- Add this route */}
              <Route path="/pretest/:id" element={<PreTest />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;