'use client';

import { useMemo } from 'react';

export default function AnalyticsDashboard({ tasks = [], sessions = [] }) {
  // Calculate Category Distribution from COMPLETED tasks
  const categoryStats = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed);
    const total = completedTasks.length;
    if (total === 0) return [];

    const counts = {};
    completedTasks.forEach(t => {
      const cat = t.category || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / total) * 100)
    })).sort((a, b) => b.value - a.value);
  }, [tasks]);

  // Calculate Focus Time
  const focusStats = useMemo(() => {
     const totalMinutes = sessions.reduce((acc, curr) => acc + curr.duration, 0);
     const hours = Math.floor(totalMinutes / 60);
     const mins = totalMinutes % 60;
     return { hours, mins, totalMinutes };
  }, [sessions]);

  // Helpers for SVG Pie Chart
  // Simple implementation to avoid heavy libraries
  const renderPieChart = () => {
     if (categoryStats.length === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                No completed tasks yet
            </div>
        );
     }

     let cumVerify = 0;
     const colors = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'];
     
     return (
        <div className="flex items-center gap-8">
            <div className="relative w-32 h-32 transform -rotate-90">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {categoryStats.map((stat, i) => {
                        // Calculate dash array for circle stroke
                        // Circumference = 2 * PI * r
                        // r = 16 (circumference ~100 for easy calc) -> actually 2 * 3.14159 * 15.915 = 100
                        const radius = 15.9155; 
                        const circumference = 100; 
                        const strokeDasharray = `${stat.percentage} ${100 - stat.percentage}`;
                        const strokeDashoffset = -cumVerify; // Negative for clockwise
                        
                        const circle = (
                            <circle
                                key={stat.name}
                                r={radius}
                                cx="50"
                                cy="50"
                                fill="transparent"
                                stroke={colors[i % colors.length]}
                                strokeWidth="32" // Thick donut
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                            />
                        );
                        cumVerify += stat.percentage;
                        return circle;
                    })}
                </svg>
            </div>
            
            {/* Legend */}
            <div className="space-y-2">
                {categoryStats.map((stat, i) => (
                    <div key={stat.name} className="flex items-center gap-2 text-sm">
                        <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: colors[i % colors.length] }}
                        />
                        <span className="font-medium">{stat.name}</span>
                        <span className="text-gray-500 text-xs">({stat.percentage}%)</span>
                    </div>
                ))}
            </div>
        </div>
     );
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
        {/* Focus Stats Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Focus Analytics</h3>
            <div className="flex items-end gap-2 mb-2">
                <span className="text-5xl font-bold tracking-tighter">
                    {focusStats.hours}
                </span>
                <span className="text-lg font-medium text-gray-500 mb-1">hrs</span>
                <span className="text-5xl font-bold tracking-tighter ml-2">
                    {focusStats.mins}
                </span>
                <span className="text-lg font-medium text-gray-500 mb-1">mins</span>
            </div>
            <p className="text-sm text-gray-400">Total focus time this year</p>
            
            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                 <div>
                    <div className="text-2xl font-bold">{quizCount}</div>
                    <div className="text-xs text-gray-400">Flashcard Quizzes</div>
                 </div>
                 <div>
                    <div className="text-2xl font-bold">{sessions.length}</div>
                    <div className="text-xs text-gray-400">Total Sessions</div>
                 </div>
            </div>
        </div>

        {/* Category Distribution Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6">
            <h3 className="text-lg font-bold mb-6">Task Distribution</h3>
            {renderPieChart()}
        </div>
    </div>
  );
}
