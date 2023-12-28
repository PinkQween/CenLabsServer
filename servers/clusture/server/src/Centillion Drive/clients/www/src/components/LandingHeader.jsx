// src/components/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate()

  return (
    <header className="bg-[#000000ad] p-4 text-white text-xl font-semibold flex align-middle justify-center content-center items-center header-shadow h-12 max-w-screen z-30">
      <Link to="/">
        <p className='text-3xl'>Centillion Drive</p>
      </Link>
      
      <div className='flex flex-1'></div>
      <button className='' onClick={() => navigate('/app')}>Head to Dashboard</button>
    </header>
  );
};

export default Header;
