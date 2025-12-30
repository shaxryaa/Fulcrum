'use client';

import { useMemo } from 'react';

export default function StreakGraph({ sessions = [], userEmail }) {
  // Generate the last 365 days
  const calendarData = useMemo(() => {
    const today = new Date();
    const days = [];
    const endDate = new Date(today);
    
    // Start from 364 days ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);

    // Create a map of sessions by date string (YYYY-MM-DD)
    const sessionMap = new Map();
    
    // Inject fake data for shaurya@gmail.com if no real data
    if (userEmail === 'shaurya@gmail.com' && sessions.length === 0) {
      // Create a pattern of "streak"
      const fakeToday = new Date();
      for (let i = 0; i < 150; i++) {
         if (Math.random() > 0.3) {
            const d = new Date(fakeToday);
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().split('T')[0];
            sessionMap.set(dateKey, (sessionMap.get(dateKey) || 0) + 1);
         }
      }
    } else {
      sessions.forEach(session => {
        const dateKey = new Date(session.createdAt).toISOString().split('T')[0];
        // Only count if duration >= 25 mins
        if (session.duration >= 25) {
            sessionMap.set(dateKey, (sessionMap.get(dateKey) || 0) + 1);
        }
      });
    }

    // Fill the array
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      const count = sessionMap.get(dateString) || 0;
      days.push({
        date: new Date(d),
        count: count,
        level: count === 0 ? 0 : count < 3 ? 1 : count < 5 ? 2 : count < 7 ? 3 : 4
      });
    }

    return days;
  }, [sessions, userEmail]);

  // Total sessions in the last year
  const totalSessions = calendarData.reduce((acc, curr) => acc + curr.count, 0);

  // Helper to color cells based on level
  const getLevelColor = (level) => {
    switch (level) {
      case 0: return 'bg-gray-100'; // Empty
      case 1: return 'bg-[#9ae6b4]'; // Light green
      case 2: return 'bg-[#48bb78]'; // Medium green
      case 3: return 'bg-[#2f855a]'; // Dark green
      case 4: return 'bg-[#22543d]'; // Darkest green
      default: return 'bg-gray-100';
    }
  };

  // Group by weeks for the grid display (GitHub style is column-major)
  // We need to construct columns. Each column is a week (Sun-Sat or Mon-Sun).
  // Standard GitHub graph starts on Sunday.
  const weeks = useMemo(() => {
     const cols = [];
     let currentWeek = [];
     
     calendarData.forEach((day, index) => {
        currentWeek.push(day);
        
        // Sunday is 0. If it's Saturday (6), push week.
        // OR if it's the last day of the dataset.
        if (day.date.getDay() === 6 || index === calendarData.length - 1) {
           // Pad the first week if data doesn't start on Sunday
           if (cols.length === 0 && currentWeek.length < 7) {
              const blanks = 7 - currentWeek.length;
              for(let i=0; i<blanks; i++) currentWeek.unshift(null);
           }
           cols.push(currentWeek);
           currentWeek = [];
        }
     });
     return cols;
  }, [calendarData]);

  // Month labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="w-full mt-12 mb-8 bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-medium">
                 <span className="font-bold">{totalSessions}</span> focus sessions this past one year
             </h3>
             {/* Legend */}
             <div className="flex items-center gap-1 text-xs text-gray-500">
                 <span>Less</span>
                 <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                 <div className="w-3 h-3 bg-[#9ae6b4] rounded-sm"></div>
                 <div className="w-3 h-3 bg-[#48bb78] rounded-sm"></div>
                 <div className="w-3 h-3 bg-[#2f855a] rounded-sm"></div>
                 <div className="w-3 h-3 bg-[#22543d] rounded-sm"></div>
                 <span>More</span>
             </div>
        </div>

        {/* Graph Container */}
        <div className="overflow-x-auto pb-2">
            <div className="flex gap-1 min-w-max">
                {weeks.map((week, wIndex) => (
                    <div key={wIndex} className="flex flex-col gap-1">
                        {week.map((day, dIndex) => (
                            day ? (
                                <div
                                    key={dIndex}
                                    className={`w-3 h-3 rounded-sm border border-gray-200 ${getLevelColor(day.level)}`}
                                    title={`${day.count} sessions on ${day.date.toDateString()}`}
                                ></div>
                            ) : (
                                <div key={`blank-${dIndex}`} className="w-3 h-3"></div>
                            )
                        ))}
                    </div>
                ))}
            </div>
            {/* Month Labels - Simplified approximation */}
            <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
                {months.map(m => <span key={m}>{m}</span>)}
            </div>
        </div>
    </div>
  );
}
