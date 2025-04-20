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

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="btn btn-secondary"
    >
      Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};

export default ThemeToggleButton;
