import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import DiagnosisTrends from './DiagnosisTrends.tsx'
import TreatmentPlan from './TreatmentPlan.tsx'

function AppRouter() {
  const [route, setRoute] = useState(window.location.hash || '#/')

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  if (route === '#/diagnosis') {
    return <DiagnosisTrends />
  }
  
  if (route.startsWith('#/treatment/')) {
    const diseaseName = decodeURIComponent(route.replace('#/treatment/', ''))
    return <TreatmentPlan diseaseName={diseaseName} />
  }

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
