import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 Webhook Demo App</h1>
        <p className="version">Version 1.3.0 - Live deploy test!</p>
      </header>
      
      <main className="main">
        <div className="card">
          <h2>Bienvenue!</h2>
          <p>Cette application est déployée automatiquement via GitHub Webhooks.</p>
          
          <div className="counter">
            <button onClick={() => setCount(c => c - 1)}>-</button>
            <span className="count">{count}</span>
            <button onClick={() => setCount(c => c + 1)}>+</button>
          </div>
          
          <p className="hint">
            Modifie ce fichier, fais un push, et regarde la magie opérer! ✨
          </p>
        </div>
      </main>
      
      <footer className="footer">
        <p>Déployé automatiquement avec 💜 par GitHub Webhooks + ngrok</p>
      </footer>
    </div>
  )
}

export default App
