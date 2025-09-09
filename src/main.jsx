import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// Configure GSAP globally to avoid noisy warnings for optional targets
import { gsap } from 'gsap'
// Safari compatibility fixes
import './safari-polyfills.js'

try {
  gsap.config({
    nullTargetWarn: false,
    trialWarn: false,
  });
} catch (_) {}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister())
  }).catch(() => {})
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
