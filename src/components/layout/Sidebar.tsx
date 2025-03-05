// src/components/layout/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  currentPath: string;
}

export default function Sidebar({ isOpen, currentPath }: SidebarProps) {
  // Nous utiliserons un hook personnalisu00e9 dans une version ultérieure
  const handleSignOut = async () => {
    // Logique de du00e9connexion
    console.log('Sign out clicked');
  };

  const menuItems = [
    { name: 'Tableau de bord', path: '/dashboard', icon: 'home' },
    { name: 'Profil', path: '/profile', icon: 'user' },
    { name: 'Rendez-vous', path: '/appointments', icon: 'calendar' },
    { name: 'Sessions', path: '/sessions', icon: 'message-circle' },
    { name: 'Paramu00e8tres', path: '/settings', icon: 'settings' },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 shadow z-20 w-64 transition-transform transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition-all duration-300 ease-in-out`}
    >
      <div className="h-full flex flex-col">
        <div className="py-6 px-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">My Muqabala 3.0</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Votre assistant personnel</p>
        </div>
        
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = currentPath === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30'
                    }`}
                  >
                    <span className={`mr-3 h-5 w-5 ${item.icon}`} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/30 rounded-md transition-colors"
          >
            <span className="mr-3 h-5 w-5 log-out" />
            <span>Du00e9connexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
