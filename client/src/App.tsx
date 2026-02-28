import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import LegacyPage from './components/LegacyPage'

const pages = [
  { path: '/dashboard', src: '/legacy/pages/dashboard.html', label: 'Dashboard' },
  { path: '/circular-intelligence', src: '/legacy/pages/circular-intelligence.html', label: 'Circular Intelligence' },
  { path: '/enforcement', src: '/legacy/pages/enforcement.html', label: 'Enforcement' },
  { path: '/image-processing', src: '/legacy/pages/image-processing.html', label: 'AI Detection' },
  { path: '/policy-intelligence', src: '/legacy/pages/policy-intelligence.html', label: 'Policy Intelligence' },
  { path: '/route-optimization', src: '/legacy/pages/route-optimization.html', label: 'Route Optimization' },
  { path: '/ward-rewards', src: '/legacy/pages/ward-rewards.html', label: 'Ward Rewards' }
]

export default function App() {
  return (
    <div>
      <nav style={{ padding: 12, background: '#071029', display: 'flex', gap: 12 }}>
        {pages.map(p => (
          <Link key={p.path} to={p.path} style={{ color: '#9fd6e8', textDecoration: 'none' }}>{p.label}</Link>
        ))}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {pages.map(p => (
          <Route key={p.path} path={p.path} element={<LegacyPage src={p.src} />} />
        ))}
      </Routes>
    </div>
  )
}
