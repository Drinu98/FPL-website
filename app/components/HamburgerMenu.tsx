"use client"

// import React, { useState } from 'react';
// import MenuContent from './MenuContent'; // Import the MenuContent component

// export default function HamburgerMenu() {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   return (
//         <>
//             <div className={`menu-toggle ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
//                 <div className="bar"></div>
//                 <div className="bar"></div>
//                 <div className="bar"></div>
//             </div>
      
//       {/* Conditionally render the menu content */}
//       {menuOpen && <MenuContent />}
//         </>  
//   );
// }
import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react';
import MenuContent from './MenuContent';

export default function HamburgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => {
    // Close the menu if it's open, otherwise open it
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <button
        className="darkmode-button"
        onClick={() => {
          const currentTheme = document.body.dataset.theme;
          document.body.dataset.theme = currentTheme === 'light' ? 'dark' : 'light';
        }}
      >
        <Image
          src="/images/darkmode.png"
          alt="Dark Mode"
          width={45} // Set the desired width of the image
          height={45}
          style={{}} // Set the desired height of the image
        />
      </button>
      <div className={`menu-toggle ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      {menuOpen && (
        <div className="menu-container" ref={menuRef}>
          <MenuContent />
        </div>
      )}
    </>
  );
}




