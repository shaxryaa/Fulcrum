'use client';

import { useRouter } from 'next/navigation';

export default function DashboardNav({ user }) {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-[#E5E5E5] z-50">
      <div className="max-w-[1400px] mx-auto px-10 py-5 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold tracking-tight">Fulcrum</div>

        {/* Navigation Menu */}
        <div className="flex items-center gap-8">
          <ul className="flex gap-8">
            <li>
              <a
                href="/dashboard"
                className="nav-link active text-base font-medium relative pb-1 inline-block transition-transform duration-200 hover:-translate-y-px"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="nav-link text-base font-medium relative pb-1 inline-block transition-transform duration-200 hover:-translate-y-px"
              >
                Calendar
              </a>
            </li>
            <li>
              <a
                href="#"
                className="nav-link text-base font-medium relative pb-1 inline-block transition-transform duration-200 hover:-translate-y-px"
              >
                Focus
              </a>
            </li>
            <li>
              <a
                href="#"
                className="nav-link text-base font-medium relative pb-1 inline-block transition-transform duration-200 hover:-translate-y-px"
              >
                Profile
              </a>
            </li>
          </ul>

          {/* User Info & Sign Out */}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-[#E5E5E5]">
            <span className="text-sm text-[#666]">{user?.name}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-black hover:underline transition-all duration-200"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #000;
          transition: width 300ms ease-in-out;
        }

        .nav-link.active::after {
          width: 100%;
        }

        .nav-link:hover::after {
          width: 100%;
        }
      `}</style>
    </nav>
  );
}
