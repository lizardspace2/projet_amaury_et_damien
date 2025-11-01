import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Filter out extension context errors from browser extensions (ad blockers, password managers, etc.)
// These errors occur when extensions reload and are not related to our application
const setupErrorHandling = () => {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    const errorMessage = event.message || '';
    const errorSource = event.filename || '';
    
    // Filter out extension context errors
    if (
      errorMessage.includes('Extension context invalidated') ||
      errorMessage.includes('Extension context invalid') ||
      errorSource.includes('chrome-extension://') ||
      errorSource.includes('moz-extension://') ||
      errorSource.includes('safari-extension://') ||
      (errorSource.includes('content.js') && errorMessage.toLowerCase().includes('extension'))
    ) {
      // Suppress these errors - they're from browser extensions, not our code
      event.preventDefault();
      return false;
    }
    
    // Log other errors normally
    return true;
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const errorMessage = typeof reason === 'string' ? reason : reason?.message || '';
    const errorStack = typeof reason === 'object' && reason?.stack ? reason.stack : '';
    
    // Filter out extension context errors
    if (
      errorMessage.includes('Extension context invalidated') ||
      errorMessage.includes('Extension context invalid') ||
      errorStack.includes('chrome-extension://') ||
      errorStack.includes('moz-extension://') ||
      errorStack.includes('safari-extension://') ||
      errorStack.includes('content.js')
    ) {
      // Suppress these errors - they're from browser extensions, not our code
      event.preventDefault();
      return;
    }
    
    // Let other rejections propagate normally
  });
};

// Set up error handling before rendering the app
setupErrorHandling();

createRoot(document.getElementById("root")!).render(
    <App />
);