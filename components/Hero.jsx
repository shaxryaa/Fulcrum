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

        {/* Dashboard Placeholder - Skeleton UI */}
        <div className="w-full max-w-[1400px] relative px-4 sm:px-6 lg:px-8 perspective-1000">
          <div className="aspect-[16/10] w-full bg-white rounded-t-2xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col transform rotate-x-2 transition-transform duration-700 hover:rotate-x-0">
            
            {/* Fake Browser Header */}
            <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <div className="ml-4 h-6 w-64 bg-gray-200 rounded-md opacity-50"></div>
            </div>

            {/* Skeleton Content */}
            <div className="flex-1 p-6 grid grid-cols-12 gap-6 bg-gray-50/50">
              {/* Sidebar */}
              <div className="col-span-2 hidden md:flex flex-col gap-4">
                <div className="h-8 w-full bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded-md opacity-60"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded-md opacity-60"></div>
                <div className="h-4 w-4/5 bg-gray-200 rounded-md opacity-60"></div>
              </div>
              
              {/* Main Content */}
              <div className="col-span-12 md:col-span-10 flex flex-col gap-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                
                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <div className="h-8 w-8 bg-gray-100 rounded-full"></div>
                        <div className="h-4 w-12 bg-gray-100 rounded-full"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                        <div className="h-12 w-full bg-gray-50 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="h-64 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-end gap-4">
                  {[40, 70, 45, 90, 60, 80, 50, 75, 60, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-black/5 rounded-t-sm hover:bg-black/10 transition-colors" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Overlay Text until actual screenshot */}
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
              <span className="bg-black/80 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-md">
                Dashboard Preview Coming Soon
              </span>
            </div>

          </div>
        </div>
        
      </div>
    </section>
  );
}
