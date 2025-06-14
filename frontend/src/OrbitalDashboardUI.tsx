import React from 'react';
import { useMediaQuery } from '@mui/material';
import MobileNav from './components/MobileNav';
import OrbitalNav from './components/OrbitalNav';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './hooks/useTheme';

export default function OrbitalDashboardUI() {
  const isMobile = useMediaQuery('(max-width:640px)');
  return (
    <ThemeProvider>
      <div className="relative min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white transition-colors">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        {isMobile ? <MobileNav /> : <OrbitalNav />}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center p-8">
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">Orbital Dashboard</h1>
          <p className="text-center sm:text-lg max-w-xl">Insightful metrics for modern municipalities</p>
        </section>
        <section id="projects" className="py-16 px-4 bg-gray-100 dark:bg-gray-800">
          <h2 className="text-3xl font-bold mb-6 text-center">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-lg bg-white/10 dark:bg-black/30">Project A</div>
            <div className="p-4 rounded-lg bg-white/10 dark:bg-black/30">Project B</div>
            <div className="p-4 rounded-lg bg-white/10 dark:bg-black/30">Project C</div>
            <div className="p-4 rounded-lg bg-white/10 dark:bg-black/30">Project D</div>
          </div>
        </section>
        <section id="contact" className="py-16 px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Contact</h2>
          <p className="text-center">contact@orbital.ai</p>
        </section>
      </div>
    </ThemeProvider>
  );
}
