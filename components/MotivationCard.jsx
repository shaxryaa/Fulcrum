'use client';

import { useMemo } from 'react';

const QUOTES = [
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
  "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
  "You miss 100% of the shots you don't take. - Wayne Gretzky",
  "It does not matter how slowly you go as long as you do not stop. - Confucius",
  "Everything you've ever wanted is on the other side of fear. - George Addair",
  "Hardships often prepare ordinary people for an extraordinary destiny. - C.S. Lewis"
];

export default function MotivationCard() {
  const quote = useMemo(() => {
    // Pick based on day of year to be "daily" and consistent
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return QUOTES[dayOfYear % QUOTES.length];
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm h-full flex items-center justify-center text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50"></div>
        <div className="relative z-10">
            <svg className="w-8 h-8 text-gray-200 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21L14.017 18C14.017 16.896 14.321 15.923 14.929 15.081C15.536 14.239 16.35 13.535 17.371 12.969V9C17.371 8.448 16.923 8 16.371 8H15C13.896 8 13 7.104 13 6V3H21V12.556C21 14.887 20.375 16.911 19.125 18.629C17.875 20.347 16.172 21.365 14.017 21ZM5.017 21L5.017 18C5.017 16.896 5.321 15.923 5.929 15.081C6.536 14.239 7.35 13.535 8.371 12.969V9C8.371 8.448 7.923 8 7.371 8H6C4.896 8 4 7.104 4 6V3H12V12.556C12 14.887 11.375 16.911 10.125 18.629C8.875 20.347 7.172 21.365 5.017 21Z" />
            </svg>
            <p className="text-lg font-serif italic text-gray-800 leading-relaxed">
                "{quote.split(' - ')[0]}"
            </p>
            <p className="text-sm font-bold text-gray-500 mt-4 uppercase tracking-widest">
                — {quote.split(' - ')[1]}
            </p>
        </div>
    </div>
  );
}
