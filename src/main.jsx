import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="9055900255-nhhulkicr3ivpjog38f85d2n18lgfums.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>,
)
