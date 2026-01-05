'use client';

import { useMemo } from 'react';

export default function StreakGraph({ sessions = [], userEmail }) {
  const currentYear = new Date().getFullYear();

  // Generate the full calendar year (Jan 1 - Dec 31)
  const calendarData = useMemo(() => {
    const days = [];
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);
    
    const sessionMap = new Map();
    
    if (userEmail === 'shaurya@gmail.com' && sessions.length === 0) {
      const today = new Date();
      for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
         if (Math.random() > 0.3) {
            const dateKey = d.toISOString().split('T')[0];
            sessionMap.set(dateKey, (sessionMap.get(dateKey) || 0) + 1);
         }
      }
    } else {
      sessions.forEach(session => {
        const dateKey = new Date(session.createdAt).toISOString().split('T')[0];
        if (session.duration >= 25) {
            sessionMap.set(dateKey, (sessionMap.get(dateKey) || 0) + 1);
        }
      });
    }

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
  }, [sessions, userEmail, currentYear]);

  // Total sessions
  const totalSessions = calendarData.reduce((acc, curr) => acc + curr.count, 0);

  // Helper to color cells based on level
  const getLevelColor = (level) => {
    switch (level) {
      case 0: return 'bg-gray-100'; // Empty
      case 1: return 'bg-[#9ae6b4]';
      case 2: return 'bg-[#48bb78]';
      case 3: return 'bg-[#2f855a]';
      case 4: return 'bg-[#22543d]';
      default: return 'bg-gray-100';
    }
  };

  const weeks = useMemo(() => {
     const cols = [];
     let currentWeek = [];
     
     const startDay = calendarData[0].date.getDay();
     for (let i = 0; i < startDay; i++) {
         currentWeek.push(null);
     }

     calendarData.forEach((day, index) => {
        currentWeek.push(day);
        if (day.date.getDay() === 6 || index === calendarData.length - 1) {
           cols.push(currentWeek);
           currentWeek = [];
        }
     });
     return cols;
  }, [calendarData]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="w-full mt-12 mb-8 bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-medium">
                 <span className="font-bold">{totalSessions}</span> focus sessions in {currentYear}
             </h3>
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

        <div className="w-full">
            <div className="flex justify-between gap-1 mb-2 w-full">
                {weeks.map((week, wIndex) => (
                    <div key={wIndex} className="flex flex-col gap-1 flex-1">
                        {week.map((day, dIndex) => (
                            day ? (
                                <div
                                    key={dIndex}
                                    className={`w-full aspect-square rounded-sm border border-gray-200 ${getLevelColor(day.level)}`}
                                    title={`${day.count} sessions on ${day.date.toDateString()}`}
                                ></div>
                            ) : (
                                <div key={`blank-${dIndex}`} className="w-full aspect-square"></div>
                            )
                        ))}
                    </div>
                ))}
            </div>
            
            <div className="flex relative h-4 w-full">
                {months.map((m, i) => (
                     <span key={m} className="absolute text-[10px] text-gray-400" style={{ left: `${(i / 12) * 100}%` }}>
                        {m}
                     </span>
                ))}
            </div>
        </div>
    </div>
  );
}
