import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './src/App.tsx'
import './src/App.css'

// Initialize default users
import { UserService } from './src/services/UserService';
UserService.initializeDefaultUsers();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
