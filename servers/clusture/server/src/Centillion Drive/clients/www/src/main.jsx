import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Tests/pages/Login';
import Register from './Tests/pages/Register';
import TestDashboard from './Tests/pages/Dashboard';
import AppOld from './Tests/pages/App';
import { UserProvider } from './Tests/contexts/user';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { Helmet } from 'react-helmet';
import Blogs from './pages/Blogs';
import BlogOutline from './templates/BlogOutline';
import AppRoutes from './app'

function AppWithReload() {
  return (
    <React.StrictMode>
      <UserProvider>
        <Helmet>
          <link rel="icon" href="/favicons/cendrivemain.png" />
          <title>Centillion Drive | Your remote hard drive</title>
        </Helmet>

        <div className="bg-[#23272A] text-white">
          <BrowserRouter>
            <Routes>
              <Route path="/testssss/login" element={<Login />} />
              <Route path="/testssss/register" element={<Register />} />
              <Route path="/testssss/dashboard" element={<TestDashboard />} />
              <Route path="/testssss" element={<AppOld />} />
              <Route path="/old/dashboard" element={<Dashboard />} />
              <Route path="/app/*" element={<AppRoutes />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:blog" element={<BlogOutline />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </div>
      </UserProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AppWithReload />);
