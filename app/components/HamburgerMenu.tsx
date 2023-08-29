"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import MenuContent from "./MenuContent";

export default function HamburgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      document.body.dataset.theme = currentTheme;
    }
  }, []);

  const toggleTheme = () => {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.body.dataset.theme = newTheme;
    localStorage.setItem("theme", newTheme);
  };

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
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <>
      <button className="darkmode-button" onClick={toggleTheme}>
        <Image
          src="/images/darkmode.png"
          alt="Dark Mode"
          width={45}
          height={45}
          style={{}}
        />
      </button>
      <div
        className={`menu-toggle ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
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
