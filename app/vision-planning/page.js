'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/config';
import LeftSidebar from '@/components/LeftSidebar';

export default function VisionPlanningPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingType, setAddingType] = useState(null); // 'weekly', 'monthly', 'yearly'
  const [newGoal, setNewGoal] = useState({ title: '', why: '' });
  
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchGoals(token);
  }, []);

  const fetchGoals = async (token) => {
    try {
      const res = await fetch(`${API_URL}/vision`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setGoals(await res.json());
      setLoading(false);
    } catch (error) { console.error(error); setLoading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/vision`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ...newGoal, type: addingType })
        });
        if (res.ok) {
            const created = await res.json();
            setGoals([...goals, created]);
            setNewGoal({ title: '', why: '' });
            setAddingType(null);
        }
    } catch (error) { console.error(error); }
  };

  const handleToggle = async (id, completed) => {
      const token = localStorage.getItem('token');
      try {
          // Optimistic
          setGoals(goals.map(g => g.id === id ? { ...g, completed } : g));
          await fetch(`${API_URL}/vision/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ completed })
          });
      } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
      const token = localStorage.getItem('token');
      try {
          await fetch(`${API_URL}/vision/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
          });
          setGoals(goals.filter(g => g.id !== id));
      } catch (error) { console.error(error); }
  };

  const renderColumn = (type, title) => {
      const typeGoals = goals.filter(g => g.type === type);
      
      return (
          <div className="flex-1 bg-gray-50 rounded-xl p-6 min-h-[500px] border border-[#E5E5E5]">
              <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold capitalize">{title}</h2>
                  <button 
                    onClick={() => setAddingType(type)}
                    className="text-sm border border-black px-2 py-1 rounded hover:bg-black hover:text-white transition-colors"
                  >
                      + Add Goal
                  </button>
              </div>

              {addingType === type && (
                  <form onSubmit={handleCreate} className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <input
                        type="text"
                        placeholder="Goal Title..."
                        className="w-full p-2 mb-2 border rounded text-sm"
                        value={newGoal.title}
                        onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                        autoFocus
                        required
                      />
                      <textarea
                        placeholder="Why is this important?"
                        className="w-full p-2 mb-2 border rounded text-sm"
                        rows={2}
                        value={newGoal.why}
                        onChange={e => setNewGoal({...newGoal, why: e.target.value})}
                      />
                      <div className="flex gap-2">
                          <button type="submit" className="flex-1 bg-black text-white text-xs py-2 rounded">Save</button>
                          <button type="button" onClick={() => setAddingType(null)} className="flex-1 border border-gray-300 text-xs py-2 rounded">Cancel</button>
                      </div>
                  </form>
              )}

              <div className="space-y-3">
                  {typeGoals.map(goal => (
                      <div key={goal.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm group">
                          <div className="flex items-start gap-3">
                              <input 
                                type="checkbox" 
                                checked={goal.completed} 
                                onChange={(e) => handleToggle(goal.id, e.target.checked)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                  <p className={`font-medium ${goal.completed ? 'line-through text-gray-400' : ''}`}>
                                      {goal.title}
                                  </p>
                                  {goal.why && (
                                      <p className="text-xs text-gray-500 mt-1 italic">
                                          "{goal.why}"
                                      </p>
                                  )}
                              </div>
                              <button 
                                onClick={() => handleDelete(goal.id)}
                                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"
                              >
                                  ×
                              </button>
                          </div>
                      </div>
                  ))}
                  {typeGoals.length === 0 && !addingType && (
                      <p className="text-center text-gray-400 text-sm py-4">No goals yet</p>
                  )}
              </div>
          </div>
      );
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-white">
      <LeftSidebar activeItem="home" /> {/* Not strictly "home" active but keeping consistent */}
      <div className="ml-48 p-10">
          <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Vision Planning</h1>
              <p className="text-gray-500">Define your long-term success across different time horizons.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
              {renderColumn('weekly', 'Weekly Goals')}
              {renderColumn('monthly', 'Monthly Goals')}
              {renderColumn('yearly', 'Yearly Goals')}
          </div>
      </div>
    </div>
  );
}
