import React from 'react';
import useTheme from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 text-xl hover:opacity-80 transition"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
