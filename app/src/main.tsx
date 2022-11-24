import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Authenticator } from '@aws-amplify/ui-react'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Authenticator.Provider>
      <App />
    </Authenticator.Provider>
  </React.StrictMode>
)
