/**
 * Main entry point for the Whois Lookup React application
 * 
 * This file initializes the React application and renders the main App component
 * into the DOM. It uses React 18's createRoot API for optimal performance.
 */

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Get the root DOM element
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a div with id="root" in your HTML.')
}

// Create React root and render the application
const root = createRoot(rootElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
