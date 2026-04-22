import React from 'react';
import { useTheme } from '../contexts/ThemeContext.js';
import { Icon } from '../components/Icon/Icon.js';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Icon name="moon" size="md" />
      ) : (
        <Icon name="sun" size="md" />
      )}
    </button>
  );
};

export default ThemeToggle;