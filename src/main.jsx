import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './fonts.css';
import './styles.css';
import App from './App.jsx';
import { routeFor } from './routes.js';
import { initAnalytics } from './lib/analytics.js';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <App route={routeFor(window.location.pathname)} />
  </StrictMode>
);

// В production HTML уже отрендерен при сборке (scripts/prerender.mjs), React его оживляет.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

// Метрика включится, только если она настроена и посетитель уже дал согласие.
initAnalytics();
