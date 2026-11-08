import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/prata/cyrillic-400.css';
import '@fontsource/prata/latin-400.css';
import '@fontsource-variable/onest/wght.css';
import './styles.css';
import App from './App.jsx';
import { initAnalytics } from './lib/analytics.js';

initAnalytics();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
