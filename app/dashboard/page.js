'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import DashboardNav from '@/components/DashboardNav';
import TaskList from '@/components/TaskList';
import StatsCard from '@/components/StatsCard';
import HighlightCard from '@/components/HighlightCard';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get formatted date
  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user
        const userRes = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!userRes.ok) throw new Error('Unauthorized');
        const userData = await userRes.json();
        setUser(userData);

        // Fetch tasks
        const tasksRes = await fetch(`${API_URL}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setTasks(tasksData);
        }

        // Fetch stats
        const statsRes = await fetch(`${API_URL}/user/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
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

  // Add new task
  const handleAddTask = async (taskData) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
        // Refresh stats
        refreshStats();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Toggle task completion
  const handleToggleTask = async (taskId, completed) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ completed })
      });

      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(tasks.map(t => (t.id === taskId ? updatedTask : t)));
        // Refresh stats
        refreshStats();
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== taskId));
        refreshStats();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Update daily highlight
  const handleUpdateHighlight = async (highlight) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/user/highlight`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ highlight })
      });
    } catch (error) {
      console.error('Error updating highlight:', error);
    }
  };

  // Refresh stats
  const refreshStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/user/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const statsData = await res.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K to add task
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Focus on add task button or trigger add task
        document.querySelector('button[type="button"]')?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="text-[#666] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <DashboardNav user={user} />

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="max-w-[1400px] mx-auto px-10">
          {/* Hero Section */}
          <section className="mt-[60px] mb-12">
            <h1 className="text-[2rem] font-semibold tracking-tight mb-2">
              {getGreeting()}, {user?.name}
            </h1>
            <p className="text-base text-[#666]">{getFormattedDate()}</p>
          </section>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            {/* Task List */}
            <TaskList
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />

            {/* Sidebar */}
            <aside className="flex flex-col gap-6">
              <StatsCard stats={stats} />
              <HighlightCard
                initialHighlight={user?.dailyHighlight}
                onUpdate={handleUpdateHighlight}
              />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
