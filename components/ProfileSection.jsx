'use client';

export default function ProfileSection({ user }) {
  return (
    <div className="relative -mt-16 px-10 mb-8">
      <div className="flex flex-col items-start gap-4">
        {/* Profile Picture - Left Side (Passport Style) */}
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-lg overflow-hidden border-4 border-white shadow-lg bg-white">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Name & Bio - Vertically stacked below picture */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-black">
            {user?.name || 'User'}
          </h2>
          <p className="text-sm text-[#666] leading-relaxed max-w-xs">
            {user?.bio || '"I don\'t care. you are you, i am me!"'}
          </p>
        </div>
      </div>
    </div>
  );
}
