import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Webhook Demo App</h1>
      <p><strong>Version 3.0.0</strong></p>
      
      <hr />
      
      <h2>Bienvenue!</h2>
      <p>Cette application est déployée automatiquement via GitHub Webhooks.</p>
      
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => setCount(c => c - 1)}>-</button>
        <span style={{ margin: '0 15px', fontSize: '20px' }}>{count}</span>
        <button onClick={() => setCount(c => c + 1)}>+</button>
      </div>
      
      <p><em>Modifie ce fichier, fais un push, et regarde la magie opérer!</em></p>
      
      <hr />
      <p>Déployé automatiquement par GitHub Webhooks + ngrok</p>
    </div>
  )
}

export default App
