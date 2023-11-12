import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Tests/pages/Login'
import Register from './Tests/pages/Register'
import TestDashboard from './Tests/pages/Dashboard'
import App from './Tests/pages/App'
import { UserProvider } from './Tests/contexts/user';
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import { Helmet } from 'react-helmet';
import Blogs from './pages/Blogs'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>

      <Helmet>
        <link rel="icon" href="/favicons/cendrivemain.png" />
        <title>Centillion Drive | Your remote hard drive</title>
      </Helmet>

      <BrowserRouter>
        <Routes>
          <Route path="/testssss/login" element={<Login />} />
          <Route path="/testssss/register" element={<Register />} />
          <Route path="/testssss/dashboard" element={<TestDashboard />} />
          <Route path="/testssss" element={<App />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>,
)
