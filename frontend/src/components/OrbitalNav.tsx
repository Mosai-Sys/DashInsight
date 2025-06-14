import React from 'react';

const items = [
  { id: 'home', label: 'Home' },
  { id: 'ai', label: 'AI' },
  { id: 'projects', label: 'Projects' },
  { id: 'compare', label: 'Compare' },
  { id: 'contact', label: 'Contact' },
];

export default function OrbitalNav() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <nav className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 p-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className="w-3 h-3 rounded-full bg-gray-400 hover:bg-mobile-active"
          style={{ minWidth: 12, minHeight: 12 }}
        />
      ))}
    </nav>
  );
}
