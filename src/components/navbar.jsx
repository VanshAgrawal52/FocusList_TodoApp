import React from 'react';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-3 bg-[#2979FF] text-white">
      <div className="flex items-center gap-4">
        <img className="w-10 h-10" src={logo} alt="FocusList logo" />
        <span className="font-bold text-2xl tracking-wide">FocusList</span>
      </div>
      <ul className="flex gap-10 text-lg font-medium">
        <li className="cursor-pointer hover:text-[#E3F2FD] transition-colors">Home</li>
        <li className="cursor-pointer hover:text-[#E3F2FD] transition-colors">Your Tasks</li>
      </ul>
    </nav>
  );
};

export default Navbar;