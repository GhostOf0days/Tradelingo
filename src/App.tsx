import { UserProvider } from './contexts/UserContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ModulesPage from './components/ModulesPage';
import Register from "./pages/register";
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
              {/* Add more routes here later for lessons, quizzes, etc. */}
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;