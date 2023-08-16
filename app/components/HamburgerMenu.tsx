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




