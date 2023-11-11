import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/testssss">
          <App />
        </Route>
        <Route path="/*">
          <Dashboard />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
