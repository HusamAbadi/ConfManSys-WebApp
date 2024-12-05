import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation(); // Get the current location
  const [isDarkTheme, setIsDarkTheme] = useState(false); // State for theme toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu toggle

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/conferences", label: "Conferences" },
    { to: "/papers", label: "Papers" },
    { to: "/authors", label: "Authors" },
    { to: "/keywords", label: "Keywords" },
  ];

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
    document.body.classList.toggle("bg-gray-800"); // Add dark background
    document.body.classList.toggle("text-white"); // Change text color for dark mode
  };

  return (
    <nav
      className={`bg-blue-600 text-white py-4 shadow-md ${
        isDarkTheme ? "bg-gray-900" : ""
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 lg:px-0">
        <h1 className="text-lg font-bold">My Conference Management</h1>
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            ></path>
          </svg>
        </button>

        {/* Desktop & Mobile Menu */}
        <ul
          className={`lg:flex lg:space-x-6 lg:items-center lg:static absolute top-14 left-0 z-10 w-full bg-blue-600 lg:bg-transparent lg:w-auto lg:pt-0 pt-4 transition-all duration-300 ease-in-out ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          {links.map((link) => (
            <li key={link.to} className="text-center lg:text-left">
              <Link
                to={link.to}
                onClick={() => setIsMenuOpen(false)} // Close menu on click in mobile view
                className={`block py-2 px-4 rounded transition duration-300 
                  ${
                    location.pathname === link.to
                      ? "bg-blue-700 font-semibold"
                      : "hover:bg-blue-500"
                  }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Theme Toggle Button */}
        {/* <button
          onClick={toggleTheme}
          className={`hidden lg:block py-2 px-4 rounded transition duration-300 ${
            isDarkTheme ? "bg-gray-700 text-white" : "bg-gray-300 text-black"
          }`}
        >
          {isDarkTheme ? "Light Mode" : "Dark Mode"}
        </button> */}
      </div>
    </nav>
  );
};

export default Navbar;
