import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DataExplorer from './pages/DataExplorer'
import LivePredictor from './pages/LivePredictor'
import ModelComparison from './pages/ModelComparison'
import ErrorAnalysis from './pages/ErrorAnalysis'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen page-bg">
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/data" element={<DataExplorer />} />
            <Route path="/predictor" element={<LivePredictor />} />
            <Route path="/comparison" element={<ModelComparison />} />
            <Route path="/errors" element={<ErrorAnalysis />} />
          </Routes>
        </main>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#ffffff',
              color: '#3d3632',
              border: '1px solid #ebe3d9',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            },
            success: {
              iconTheme: { primary: '#81b29a', secondary: '#fff' }
            },
            error: {
              iconTheme: { primary: '#e05c8c', secondary: '#fff' }
            }
          }}
        />
      </div>
    </BrowserRouter>
  )
}
