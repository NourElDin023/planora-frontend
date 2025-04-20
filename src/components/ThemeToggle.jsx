import { useState, useEffect } from 'react';

const ThemeToggleButton = () => {
  // Check if there's a theme preference in localStorage
  const storedTheme = localStorage.getItem('theme') || 'light';
  const [theme, setTheme] = useState(storedTheme);

  useEffect(() => {
    // Apply the theme class to the body
    document.body.className = theme;
    // Store theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-link nav-link px-2 d-flex align-items-center text-white"
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
