import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/10">
      
      {/* Final CTA */}
      <div className="py-24 md:py-32 flex flex-col items-center text-center px-6">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-8 text-black">
          Ready to take control?
        </h2>
        <Link href="/signup" className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-semibold tracking-wide text-white bg-black rounded-full overflow-hidden transition-all hover:bg-gray-900 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
           <span className="relative">Start for free</span>
        </Link>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-gray-100">
        <p className="text-gray-500 text-sm font-medium">
          &copy; {new Date().getFullYear()} Fulcrum. All rights reserved.
        </p>
        
        <div className="flex items-center gap-6">
           <Link href="#" className="text-gray-400 hover:text-black transition-colors">
              <Twitter className="h-5 w-5" />
           </Link>
           <Link href="https://github.com/shaxryaa/Fulcrum" className="text-gray-400 hover:text-black transition-colors">
              <Github className="h-5 w-5" />
           </Link>
        </div>
      </div>
    </footer>
  );
}
