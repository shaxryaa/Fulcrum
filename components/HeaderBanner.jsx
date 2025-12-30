'use client';

import { useState } from 'react';

export default function HeaderBanner({ imageUrl, onUpload }) {
  const [isHovering, setIsHovering] = useState(false);



  return (
    <div
      className="relative w-full h-48 bg-gradient-to-r from-pink-100 to-pink-200 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Header banner"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-gray-400">
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Header Image</p>
          </div>
        </div>
      )}

      {/* Upload overlay */}
      {isHovering && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-200">
          <button 
            onClick={onUpload}
            className="px-6 py-3 bg-white text-black rounded font-medium hover:bg-gray-100 transition-colors duration-200"
          >
            Change Header Image
          </button>
        </div>
      )}
    </div>
  );
}
