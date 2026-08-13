import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('raiTheme') as 'dark' | 'light') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('raiTheme', theme);
  }, [theme]);

  const toggle = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        color: 'var(--text-secondary)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          opacity: theme === 'dark' ? 1 : 0,
          transform: theme === 'dark' ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(90deg)',
        }}
      >
        <Moon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
      </span>
      <span
        style={{
          position: 'absolute',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
          opacity: theme === 'light' ? 1 : 0,
          transform: theme === 'light' ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-90deg)',
        }}
      >
        <Sun className="w-4 h-4" style={{ color: '#f59e0b' }} />
      </span>
    </button>
  );
};
