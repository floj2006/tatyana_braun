import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource/prata/cyrillic-400.css';
import '@fontsource/prata/latin-400.css';
import '@fontsource-variable/onest/wght.css';
import './styles.css';
import App from './App.jsx';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// В production HTML уже отрендерен при сборке (scripts/prerender.mjs), React его оживляет.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
