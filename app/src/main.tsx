import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@cloudscape-design/global-styles/index.css'
import '@aws-amplify/ui-react/styles.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
