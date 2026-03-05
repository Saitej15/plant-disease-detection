import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'

const isConfigured =
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co';

if (!isConfigured) {
  createRoot(document.getElementById('root')!).render(
    <div style={{ padding: 40, fontFamily: 'system-ui, sans-serif', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
      <h1 style={{ color: '#ef4444' }}>Configuration Required</h1>
      <p>It looks like you haven't set up your environment variables yet.</p>
      <p>To use PlantIQ, please follow these steps:</p>
      <ol>
        <li>Create a Supabase project at <a href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com</a>.</li>
        <li>Copy your Project URL and anon public key.</li>
        <li>Replace the placeholder values in the <code>.env</code> file with your actual keys.</li>
        <li>Restart the development server.</li>
      </ol>
      <p>See the <code>implementation_plan.md</code> artifact or the project instructions for more details on setting up Google Gemini and Plant.id APIs as well.</p>
    </div>
  )
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
