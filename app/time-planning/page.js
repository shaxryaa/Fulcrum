'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import LeftSidebar from '@/components/LeftSidebar';

export default function TimePlanningPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [duration, setDuration] = useState(30); // minutes
  const [allocations, setAllocations] = useState({}); // { "hour-block": taskId }
  const [currentTime, setCurrentTime] = useState(new Date());

  // Hours to display (6 AM to 11 PM)
  const hours = Array.from({ length: 18 }, (_, i) => i + 6);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTasks(token);
    
    // Timer for "passed time" viz
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchTasks = async (token) => {
      try {
          const res = await fetch(`${API_URL}/tasks`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
              const data = await res.json();
              setTasks(data.filter(t => !t.completed)); // Only active tasks
          }
      } catch (error) { console.error(error); }
  };

  const handleBlockClick = (h, b) => {
      if (!selectedTask) return;

      // Check collision
      const blocksNeeded = Math.ceil(duration / 10);
      const newAllocations = { ...allocations };
      let collision = false;
      
      // Calculate start index absolute (0 = 6:00, 1 = 6:10 ... 18*6 total)
      const startHourIndex = h - 6;
      const startAbsIndex = startHourIndex * 6 + b;

      for (let i = 0; i < blocksNeeded; i++) {
          const absIndex = startAbsIndex + i;
          const targetH = Math.floor(absIndex / 6) + 6;
          const targetB = absIndex % 6;
          
          if (targetH > 23) { collision = true; break; } // Out of bounds
          
          const key = `${targetH}-${targetB}`;
          if (newAllocations[key]) {
              collision = true;
              break;
          }
          newAllocations[key] = selectedTask.id;
      }

      if (collision) {
          alert('Collision detected! Choose another time or shorter duration.');
          return;
      }

      setAllocations(newAllocations);
      setSelectedTask(null);
  };

  const isTimePassed = (h, b) => {
      const now = currentTime;
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      if (currentHour > h) return true;
      if (currentHour === h) {
          // Block 0: 0-9, Block 1: 10-19...
          // If currentMinute is 15, block 0 (0-9) is passed. Block 1 (10-19) is current/passed?
          // "When 10 minutes will be passed". So after 10.
          if (currentMinute >= (b + 1) * 10) return true;
      }
      return false;
  };

  const clearAllocations = () => {
      if(confirm('Clear all plans?')) setAllocations({});
  };

  return (
    <div className="min-h-screen bg-white">
      <LeftSidebar activeItem="home" />
      <div className="ml-48 p-8 flex gap-8 h-screen overflow-hidden">
          
          {/* Main: Time Grid */}
          <div className="flex-1 overflow-y-auto pr-4 pb-20">
              <div className="flex justify-between items-center mb-6">
                  <div>
                      <h1 className="text-2xl font-bold">Plan Your Day</h1>
                      <p className="text-gray-500 text-sm">{new Date().toLocaleDateString()}</p>
                  </div>
                  <button onClick={clearAllocations} className="text-xs text-red-500 hover:underline">Clear Plan</button>
              </div>

              <div className="space-y-6">
                  {hours.map(h => (
                      <div key={h} className="flex items-center gap-6">
                          <div className="w-16 text-right text-xs font-bold text-gray-400">
                              {h === 12 ? '12 PM' : h > 12 ? `${h-12} PM` : `${h} AM`}
                          </div>
                          
                          <div className="flex-1 flex gap-4">
                              {[0, 1, 2, 3, 4, 5].map(b => {
                                  const key = `${h}-${b}`;
                                  const taskId = allocations[key];
                                  const passed = isTimePassed(h, b);
                                  const task = tasks.find(t => t.id === taskId);
                                  
                                  // Determine appearance
                                  let bgClass = "bg-transparent";
                                  let borderClass = "border-2 border-gray-200";
                                  
                                  if (passed) {
                                      bgClass = "bg-black"; // Passed time is black
                                      borderClass = "border-black";
                                  } else if (taskId) {
                                      bgClass = "bg-gray-300"; // Planned is gray fill
                                      borderClass = "border-gray-300";
                                  }

                                  return (
                                      <div 
                                        key={b} 
                                        onClick={() => handleBlockClick(h, b)}
                                        className={`w-8 h-8 rounded-full ${bgClass} ${borderClass} relative group transition-colors cursor-pointer hover:opacity-80`}
                                        title={task ? `Planned: ${task.title}` : 'Free - Click to Assign'}
                                      >
                                          {/* Tooltip or Label if needed */}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* Sidebar: To Do Selection */}
          <div className="w-80 border-l border-gray-100 pl-8 pt-2 overflow-y-auto">
              <h2 className="font-bold mb-4">To Do List</h2>
              
              {/* Allocation Controls */}
              {selectedTask && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 sticky top-0 z-10">
                      <p className="text-xs text-gray-400 uppercase font-bold mb-2">Assigning Time For:</p>
                      <p className="font-bold mb-4 truncate">{selectedTask.title}</p>
                      
                      <div className="flex items-center gap-2 mb-4">
                          <button onClick={() => setDuration(Math.max(10, duration - 10))} className="w-8 h-8 rounded bg-white border flex items-center justify-center">-</button>
                          <span className="flex-1 text-center text-sm font-medium">{duration} min</span>
                          <button onClick={() => setDuration(duration + 10)} className="w-8 h-8 rounded bg-white border flex items-center justify-center">+</button>
                      </div>

                      <div className="text-xs text-center text-gray-500 mb-4 bg-white p-2 rounded border border-dashed border-gray-300">
                          Click any empty circle on the grid to start the task from there!
                      </div>

                      <button 
                        onClick={() => setSelectedTask(null)}
                        className="w-full px-3 py-2 border border-black bg-black text-white rounded text-xs hover:bg-gray-800"
                      >
                          Cancel Selection
                      </button>
                  </div>
              )}

              <div className="space-y-2 pb-20">
                  {tasks.length === 0 && <p className="text-gray-400 text-sm">No active tasks.</p>}
                  {tasks.map(task => (
                      <div 
                        key={task.id}
                        onClick={() => {
                            setSelectedTask(task);
                            setDuration(30); // reset default
                        }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedTask?.id === task.id 
                            ? 'border-black bg-gray-50 ring-1 ring-black' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                          <p className="text-sm font-medium">{task.title}</p>
                          <div className="flex gap-2 mt-2">
                             <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                                 task.priority === 'high' ? 'bg-red-100 text-red-600' : 
                                 task.priority === 'medium' ? 'bg-orange-100 text-orange-600' : 
                                 'bg-green-100 text-green-600'
                             }`}>
                                 {task.priority}
                             </span>
                             {task.difficulty && (
                                 <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded capitalize">
                                     {task.difficulty}
                                 </span>
                             )}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}
