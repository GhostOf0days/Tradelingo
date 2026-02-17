import { UserProvider } from './contexts/UserContext';
import Header from './components/Header';
import ModulesPage from './components/ModulesPage';
import './App.css';

function App() {
  return (
    <UserProvider>
      <div className="app">
        <Header />
        <main className="app__main">
          <ModulesPage />
        </main>
      </div>
    </UserProvider>
  );
}

export default App;
