'use client';

import { useRouter } from 'next/navigation';

export default function LeftSidebar({ activeItem = 'home' }) {
  const router = useRouter();

  const menuItems = [
    { id: 'home', label: 'Home', href: '/dashboard' },
    { id: 'calendar', label: 'Calendar', href: '/calendar' },
    { id: 'focus', label: 'Focus', href: '/focus' },
    { id: 'flashcards', label: 'Flashcards', href: '/flashcards' },
    { id: 'profile', label: 'Profile', href: '/profile' }
  ];

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-48 bg-white border-r border-[#E5E5E5] flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-[#E5E5E5]">
        <h1 className="text-xl font-bold tracking-tight">Fulcrum</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.href}
                className={`block px-6 py-3 text-base font-medium transition-all duration-200 ${
                  activeItem === item.id
                    ? 'bg-black text-white'
                    : 'text-black hover:bg-[#F5F5F5]'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sign Out */}
      <div className="p-6 border-t border-[#E5E5E5]">
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 text-sm text-black border border-black rounded hover:bg-black hover:text-white transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
