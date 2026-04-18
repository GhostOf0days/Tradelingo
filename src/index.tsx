// Vite entry: mounts the React tree on #root and enables StrictMode in dev
// (double-invokes some lifecycles to surface unsafe side effects).
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
