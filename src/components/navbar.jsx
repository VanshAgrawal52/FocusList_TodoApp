import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <nav className="flex justify-between items-center px-8 py-3 bg-blue-600 dark:bg-gray-800 text-white transition-colors">
      <div className="flex items-center gap-4">
        <img className="w-10 h-10" src={logo} alt="FocusList logo" />
        <span className="font-bold text-2xl tracking-wide">FocusList</span>
      </div>
      
      <div className="flex items-center gap-6">
        <ul className="flex gap-10 text-lg font-medium">
          <li className="cursor-pointer hover:text-blue-200 dark:hover:text-gray-300 transition-colors">Home</li>
          <li className="cursor-pointer hover:text-blue-200 dark:hover:text-gray-300 transition-colors">Your Tasks</li>
        </ul>
        
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-blue-700 dark:bg-gray-700 hover:bg-blue-800 dark:hover:bg-gray-600 transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;