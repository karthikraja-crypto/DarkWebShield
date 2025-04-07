
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('main.tsx executing');

// Function to handle manual refresh if needed
const refreshApp = () => {
  console.log('refreshApp called');
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Failed to find the root element');
    throw new Error('Failed to find the root element');
  }
  
  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Initial render
console.log('Starting initial render');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find the root element');
  throw new Error('Failed to find the root element');
}
const root = createRoot(rootElement);

console.log('Rendering React app');
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Make refresh function available globally (for debugging purposes)
(window as Window).refreshApp = refreshApp;

console.log('main.tsx initialization complete');
