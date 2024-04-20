import React from 'react';
import logo from '../assets/images/logo.png';

const Navbar = () => {
  return (
    <nav style={{ background: 'black', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ width: '200px', marginRight: '10px' }} />
      </div>
    </nav>
  );
};

export default Navbar;
