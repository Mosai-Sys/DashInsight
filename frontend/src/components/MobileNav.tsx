import React, { useEffect, useState } from 'react';

const items = [
  { id: 'home', label: 'Home' },
  { id: 'ai', label: 'AI' },
  { id: 'projects', label: 'Projects' },
  { id: 'compare', label: 'Compare' },
  { id: 'contact', label: 'Contact' },
];

export default function MobileNav() {
  const [active, setActive] = useState('home');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.6 }
    );
    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around backdrop-blur-md bg-white/10 border-t border-white/20">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className="flex flex-col items-center text-xs w-16 py-3"
          style={{ minWidth: 48 }}
        >
          <span
            className={`w-2 h-2 rounded-full mb-1 ${
              active === item.id ? 'bg-mobile-active glow' : 'bg-gray-400'
            }`}
          ></span>
          {active === item.id && <span>{item.label}</span>}
        </button>
      ))}
    </nav>
  );
}
