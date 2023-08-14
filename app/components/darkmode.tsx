"use client"
import React, { useState } from 'react';

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
      // Toggle darkMode first, then update class
      setDarkMode(prevDarkMode => !prevDarkMode);
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.classList.toggle('dark-theme');
      }

      // Toggle class for widgets with numbers
    // for (let i = 0; i <= totalNumberOfWidgets; i++) {
    //     const widgetElement = document.querySelector(`.widget${i}`);
    //     if (widgetElement) {
    //       widgetElement.classList.toggle('dark-widget');
    //     }
    //   }
    // };
    const widgets = document.querySelectorAll('[class^="widget"]');
    widgets.forEach(widget => {
      widget.classList.toggle('dark-widget');

    //   const isPlayerInfoWidget = widget.classList.contains('player-info');
    //   if (isPlayerInfoWidget) {
    //     widget.classList.toggle('dark-player-info');
    //   }
    });
  };

  const textElements = document.querySelectorAll('*:not(h2):not(h4):not(select):not(button)');
    textElements.forEach(element => {
      element.classList.toggle('dark-text');
    });

  
    return (
      <button className='theme-toggle-button' onClick={toggleDarkMode}>
        {darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      </button>
    );
};

export default DarkModeToggle;


// import React, { useState } from 'react';

// const DarkModeToggle = () => {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDarkMode = () => {
//     setDarkMode(prevDarkMode => !prevDarkMode);
//   };

//   return (
//     <button className='theme-toggle-button' onClick={toggleDarkMode}>
//       {darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
//     </button>
//   );
// };

// export default DarkModeToggle;
