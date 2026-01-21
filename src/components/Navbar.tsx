"use client"; // if using Next.js App Router — otherwise optional

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav
      className="
      shadow-sm
        fixed top-0 left-0 right-0 z-50
        bg-white/20 backdrop-blur-md border-b border-white/20
        transition-all duration-300
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="shrink-0">
            <h2 className="font-bold text-xl md:text-3xl text-gray-900 shadow-none tracking-tight">
              Flight <span className="text-amber-900 shadow-none">Finder</span>
            </h2>
          </div>

          {/* Desktop Menu */}
<div className="hidden md:flex items-center space-x-8">
  {navLinks.map((link) => (
    <a
      key={link.name}
      href={link.href}
      className="
        relative text-lg font-semibold text-gray-800
        before:absolute before:-bottom-1 before:left-0 before:h-0.5 before:w-0 before:bg-amber-400 before:transition-all before:duration-300
        hover:text-amber-300 hover:before:w-full
        transition-colors duration-300
      "
    >
      {link.name}
    </a>
  ))}
</div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-amber-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {/* Hamburger / X icon with animation */}
              <div className="w-8 h-8 flex  flex-col items-center justify-center">
                <span
                  className={`
                    block w-6 h-0.5 bg-amber-800 rounded-full
                    transition-all duration-300 ease-in-out
                    ${isOpen ? "rotate-45 translate-y-1.5" : ""}
                  `}
                />
                <span
                  className={`
                    block w-6 h-0.5 bg-amber-800 rounded-full mt-1.5
                    transition-all duration-300 ease-in-out
                    ${isOpen ? "opacity-0" : ""}
                  `}
                />
                <span
                  className={`
                    block w-6 h-0.5 bg-amber-800 rounded-full mt-1.5
                    transition-all duration-300 ease-in-out
                    ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}
                  `}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay / Dropdown */}
      <div
        className={`
          md:hidden
          overflow-hidden transition-all duration-300 ease-in-out
          ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-4 pt-2 pb-4 bg-white/40 backdrop-blur-md border-b border-white/20">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)} // close on link click
                className="
                  text-base font-medium text-gray-900
                  hover:text-black transition-colors
                  py-2 px-3 rounded-lg hover:bg-white/30
                "
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}