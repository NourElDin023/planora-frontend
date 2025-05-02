import { useState, useEffect } from 'react';

const ThemeToggleButton = () => {
  const storedTheme = localStorage.getItem('theme') || 'light';
  const [theme, setTheme] = useState(storedTheme);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);

    // Apply CSS variables for the theme
    if (theme === 'dark') {
      document.documentElement.style.setProperty('--header-bg', '#3a3a3a');
      document.documentElement.style.setProperty('--text-color', '#f5f5f5');
      document.documentElement.style.setProperty('--text-muted', '#aaa');
      document.documentElement.style.setProperty('--card-bg', '#3a3a3a');
      document.documentElement.style.setProperty('--button-bg', '#0d6efd');
      document.documentElement.style.setProperty('--button-hover-bg', '#4e0e9e');
      document.documentElement.style.setProperty('--cta-bg', '#3a3a3a');
      document.documentElement.style.setProperty('--cta-button-bg', '#0d6efd');
      document.documentElement.style.setProperty('--cta-button-hover-bg', '#4e0e9e');
    } else {
      document.documentElement.style.setProperty('--header-bg', '#f0f8ff');
      document.documentElement.style.setProperty('--text-color', '#2c3e50');
      document.documentElement.style.setProperty('--text-muted', '#7f8c8d');
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
      document.documentElement.style.setProperty('--button-bg', '#3498db');
      document.documentElement.style.setProperty('--button-hover-bg', '#2980b9');
      document.documentElement.style.setProperty('--cta-bg', '#f8f9fa');
      document.documentElement.style.setProperty('--cta-button-bg', '#2ecc71');
      document.documentElement.style.setProperty('--cta-button-hover-bg', '#27ae60');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-link nav-link px-2 d-flex align-items-center"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <i className="bi bi-moon-fill fs-5"></i>
      ) : (
        <i className="bi bi-brightness-high-fill fs-5"></i>
      )}
    </button>
  );
};

export default ThemeToggleButton;
