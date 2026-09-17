import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import RefineAI from './RefineAI';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RefineAI />
  </StrictMode>
);
