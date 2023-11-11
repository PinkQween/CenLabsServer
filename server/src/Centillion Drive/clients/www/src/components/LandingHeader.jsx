// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate()

  return (
    <header className="bg-[#1d2046] p-4 text-white text-xl font-semibold flex align-middle justify-center content-center items-center header-shadow">
      <p className='text-3xl'>Centillion Drive</p>
      <div className='flex flex-1'></div>
      <button className='button' onClick={() => navigate('/dashboard')}>Head to Dashboard</button>
    </header>
  );
};

export default Header;
