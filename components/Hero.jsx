'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="w-full bg-white text-black flex flex-col items-center overflow-hidden">
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center">
        
        {/* Top Content Container - Occupies ~75% of viewport to push dashboard down */}
        <div className="min-h-[75vh] flex flex-col items-center justify-center w-full py-16 md:py-24 relative z-10">
          
          {/* Main Headline */}
          <div className="flex flex-col items-center text-center gap-y-2 md:gap-y-6 mb-12 w-full px-4">
            
            {/* Line 1: Why be [Image] */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-[0.9]">
                Why be
              </h1>
              <div className="relative w-28 h-28 md:w-40 md:h-40">
                <Image 
                  src="/illustration-overwhelmed.png" 
                  alt="Overwhelmed" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Line 2: When you can be */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-[0.9] text-black/90">
              When you can be
            </h1>

            {/* Line 3: [Image] */}
            <div className="relative w-28 h-28 md:w-50 md:h-50 -rotate-3  mt-2 md:mt-4">
              <Image 
                src="/illustration-in-control.png" 
                alt="In Control" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl font-medium tracking-tight text-center max-w-2xl mx-auto mb-10 text-gray-600 px-4">
            Stop juggling apps. Start getting things done. <br className="hidden md:block"/>
            The all-in-one workspace for modern teams.
          </p>
          
          {/* CTA */}
          <div className="flex justify-center w-full">
            <Link href="/signup" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold tracking-wide text-white bg-black rounded-full overflow-hidden transition-all hover:bg-gray-900 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              <span className="relative">Start for free</span>
              <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="w-full max-w-[1200px] relative px-4 sm:px-6 lg:px-8 mt-8 mb-12">
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border border-gray-200 group">
            <Image 
              src="/dashboard-mockup.png" 
              alt="Fulcrum Dashboard Interface" 
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.01]"
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        </div>
        
      </div>
    </section>
  );
}
