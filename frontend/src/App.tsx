import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { IssuesPage } from './pages/IssuesPage'
import { IssuePage } from './pages/IssuePage'
import styles from './App.module.css'

export function App() {
  return (
    <BrowserRouter>
      <div className={styles.layout}>
        <Header />
        <Routes>
          <Route path="/" element={<IssuesPage />} />
          <Route path="/issues/:id" element={<IssuePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <main style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text)' }}>
        404 — Page not found
      </h1>
      <p style={{ fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
        The page you are looking for does not exist.
      </p>
      <a href="/" style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)' }}>
        Go back to issues
      </a>
    </main>
  )
}
