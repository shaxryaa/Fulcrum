'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-black tracking-tight">
              FULCRUM.
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
             <Link href="/login" className="text-black hover:opacity-70 font-medium transition-opacity">
                Log in
              </Link>
             <Link href="/signup" className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-black text-sm font-medium rounded-full text-white bg-black hover:bg-black/90 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
