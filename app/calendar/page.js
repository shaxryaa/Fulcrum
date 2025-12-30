'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import LeftSidebar from '@/components/LeftSidebar';

export default function CalendarPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTasks(token);
  }, []);

  const fetchTasks = async (token) => {
      try {
          const res = await fetch(`${API_URL}/tasks`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
              setTasks(await res.json());
          }
      } catch (error) { console.error(error); }
  };

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  // Pad empty days
  for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
  }
  // Days
  for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
  }

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="min-h-screen bg-white">
      <LeftSidebar activeItem="calendar" />
      <div className="ml-48 p-10 h-screen flex flex-col">
          <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">
                  {monthNames[month]} {year}
              </h1>
              <div className="flex gap-2">
                  <button onClick={handlePrevMonth} className="p-2 border rounded hover:bg-gray-100">
                      ←
                  </button>
                  <button onClick={handleNextMonth} className="p-2 border rounded hover:bg-gray-100">
                      →
                  </button>
              </div>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 border-t border-l border-gray-200 grid grid-cols-7 grid-rows-6">
              {/* Header */}
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                  <div key={day} className="h-10 flex items-center justify-center border-r border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-400">
                      {day}
                  </div>
              ))}

              {/* Days */}
              {days.map((date, idx) => {
                  if (!date) {
                      return <div key={idx} className="bg-gray-50/30 border-r border-b border-gray-200"></div>;
                  }

                  const dateTasks = tasks.filter(t => {
                      if (!t.dueDate) return false;
                      const d = new Date(t.dueDate);
                      return d.getDate() === date.getDate() &&
                             d.getMonth() === date.getMonth() &&
                             d.getFullYear() === date.getFullYear();
                  });

                  const isToday = new Date().toDateString() === date.toDateString();

                  return (
                      <div key={idx} className={`border-r border-b border-gray-200 p-2 min-h-[100px] relative hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50' : ''}`}>
                          <span className={`text-sm font-semibold mb-2 block ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                              {date.getDate()}
                          </span>
                          
                          <div className="space-y-1 overflow-y-auto max-h-[80px]">
                              {dateTasks.map(task => (
                                  <div 
                                    key={task.id} 
                                    className={`text-[10px] px-1.5 py-0.5 rounded truncate border text-xs ${
                                        task.priority === 'high' ? 'bg-red-50 border-red-100 text-red-700' : 
                                        task.completed ? 'bg-gray-100 text-gray-400 line-through' :
                                        'bg-white border-gray-200 text-gray-700'
                                    }`}
                                    title={task.title}
                                  >
                                      {task.title}
                                  </div>
                              ))}
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
    </div>
  );
}
