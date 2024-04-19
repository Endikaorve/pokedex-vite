import React from 'react'
import ReactDOM from 'react-dom/client'
import { Router } from './ui/router'
import './ui/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
)
