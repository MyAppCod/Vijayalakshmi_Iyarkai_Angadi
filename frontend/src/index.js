import 'bootstrap/dist/css/bootstrap.min.css';

// import './styles/theme.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated for React 18+
import App from './App';
import { AuthProvider } from './context/AuthContext';

// Initialize AOS (if needed)
AOS.init();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);