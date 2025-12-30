'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import LeftSidebar from '@/components/LeftSidebar';
import HeaderBanner from '@/components/HeaderBanner';
import ProfileSection from '@/components/ProfileSection';
import TaskList from '@/components/TaskList';
import StreakGraph from '@/components/StreakGraph';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import DailyJournal from '@/components/DailyJournal';
import MotivationCard from '@/components/MotivationCard';
import WheelOfLife from '@/components/WheelOfLife';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [streakData, setStreakData] = useState([]); // Sessions
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user data, tasks, and streak
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch user
        const userRes = await fetch(`${API_URL}/auth/me`, { headers });
        if (!userRes.ok) throw new Error('Unauthorized');
        const userData = await userRes.json();
        setUser(userData);

        // Fetch tasks
        const tasksRes = await fetch(`${API_URL}/tasks`, { headers });
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }

        // Fetch streak/sessions
        const streakRes = await fetch(`${API_URL}/user/streak`, { headers });
        if (streakRes.ok) {
            const data = await streakRes.json();
            setStreakData(data.sessions || []);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    fetchData();
  }, [router]);

  // Header Image Update Logic
  const handleUpdateHeader = async () => {
      const url = prompt("Enter new header image URL:");
      if (!url) return;
      
      const token = localStorage.getItem('token');
      try {
          const res = await fetch(`${API_URL}/user/profile`, {
              method: 'PATCH',
              headers: { 
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify({ headerImage: url })
          });
          if (res.ok) {
              setUser({ ...user, headerImage: url });
          }
      } catch(e) { console.error(e); }
  };

  // Task Handlers
  const handleAddTask = async (taskData) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(taskData)
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
      }
    } catch (error) { console.error(error); }
  };

  const handleToggleTask = async (taskId, completed) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ completed })
      });
      if (res.ok) {
        if (completed) {
            setTasks(tasks.filter(t => t.id !== taskId));
        } else {
            const updatedTask = await res.json();
            setTasks(tasks.map((t) => (t.id === taskId ? updatedTask : t)));
        }
      }
    } catch (error) { console.error(error); }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
         method: 'DELETE',
         headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) { console.error(error); }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-[#666] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <LeftSidebar activeItem="home" />

      <div className="ml-48">
        <HeaderBanner
          imageUrl={user?.headerImage}
          onUpload={handleUpdateHeader} 
        />

        <ProfileSection user={user} />

        <main className="px-10 py-0">
          
          {/* --- Section 1: Productivity Core --- */}
          {/* Task List (Left) and Daily Motivation (Right) */}
          <div className="mb-12 grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
             <div className="lg:col-span-2">
                 <TaskList
                    tasks={tasks}
                    onAddTask={handleAddTask}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                  />
             </div>
             <div className="lg:col-span-2 sticky top-8">
                 <MotivationCard />
             </div>
          </div>

          {/* --- Section 2: Consistency Visuals --- */}
          <section className="mb-12">
             <h2 className="text-xl font-bold mb-4">Consistency</h2>
             <StreakGraph sessions={streakData} userEmail={user?.email} />
          </section>

          {/* Analytics Section */}
          <section className="mb-12">
             <h2 className="text-xl font-bold mb-4">Progress Analytics</h2>
             <AnalyticsDashboard 
                tasks={tasks} 
                sessions={streakData} 
                quizCount={user?.quizzesTaken || 0}
             />
          </section>

          {/* Planning Section Grid */}
          <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Vision Planning Card */}
             <Link href="/vision-planning">
                <div className="w-full bg-black text-white p-8 rounded-xl cursor-pointer hover:bg-gray-900 transition-colors shadow-lg group h-full flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Vision Planning</h3>
                        <p className="text-gray-300 text-sm">Map out your weekly, monthly, and yearly goals.</p>
                    </div>
                    <div className="flex justify-end mt-4">
                        <svg className="w-8 h-8 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
             </Link>

             {/* Time Blocking Card */}
             <Link href="/time-planning">
                <div className="w-full bg-white border border-gray-200 p-8 rounded-xl cursor-pointer hover:border-black transition-colors shadow-sm group h-full flex flex-col justify-between">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Plan Your Day</h3>
                        <p className="text-gray-500 text-sm">Time block your tasks for maximum productivity.</p>
                    </div>
                    <div className="flex justify-end mt-4">
                        <svg className="w-8 h-8 text-black transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
             </Link>
          </section>

          {/* Wheel of Life */}
          <section className="mb-12">
              <WheelOfLife />
          </section>

          {/* Daily Journal Section */}
          <section>
             <DailyJournal />
          </section>

        </main>
      </div>
    </div>
  );
}
