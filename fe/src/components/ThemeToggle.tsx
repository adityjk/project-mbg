import { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

// Initialize theme immediately to prevent flash
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    return savedTheme;
  }
  return 'mbgTheme';
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'mbgTheme' ? 'mbgDark' : 'mbgTheme');
  };

  return (
    <button 
      onClick={toggleTheme}
      className="btn btn-circle bg-base-100 border-2 border-neutral hover:bg-base-200 text-neutral shadow-neo-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
      title={theme === 'mbgTheme' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'mbgTheme' ? <MdDarkMode size={24} /> : <MdLightMode size={24} />}
    </button>
  );
}
