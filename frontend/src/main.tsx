import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import DiagnosisTrends from './DiagnosisTrends.tsx'
import TreatmentPlan from './TreatmentPlan.tsx'
import ClinicInsights from './ClinicInsights.tsx'

import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import ReportsPage from './pages/ReportsPage.tsx'

const TreatmentWrapper = () => {
  const { diseaseName } = useParams();
  return <TreatmentPlan diseaseName={decodeURIComponent(diseaseName || '')} />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/diagnosis" element={<DiagnosisTrends />} />
        <Route path="/clinics" element={<ClinicInsights />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/treatment/:diseaseName" element={<TreatmentWrapper />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
