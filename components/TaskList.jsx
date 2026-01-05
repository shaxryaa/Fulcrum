'use client';

import { useState } from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onAddTask, onToggleTask, onDeleteTask }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium',
    difficulty: 'medium',
    category: 'Work',
    dueDate: '',
    isHighlight: false,
    spacedRepetition: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      await onAddTask(newTask);
      setNewTask({
        title: '',
        priority: 'medium',
        difficulty: 'medium',
        category: 'Work',
        dueDate: '',
        isHighlight: false,
        spacedRepetition: false
      });
      setIsAdding(false);
    }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  
  const visibleTasks = activeTasks.filter(t => {
      if (!t.isSpacedRepetition) return true;
      
      const due = new Date(t.dueDate);
      const now = new Date();
      const dueDay = new Date(due).setHours(0,0,0,0);
      const todayDay = new Date(now).setHours(0,0,0,0);
      return dueDay <= todayDay;
  });

  const sortedTasks = [...visibleTasks].sort((a, b) => {
    if (a.isHighlight && !b.isHighlight) return -1;
    if (!a.isHighlight && b.isHighlight) return 1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const difficultyColors = {
    hard: '#DC2626',
    medium: '#FBBF24',
    easy: '#10B981'
  };

  const categories = ['Work', 'Personal', 'Study', 'Health', 'General'];

  return (
    <div className="w-full max-w-xl">
      <h2 className="text-2xl font-bold mb-6">Today's Tasks</h2>

      <div className="bg-white border border-[#E5E5E5] rounded-lg p-4 mb-4">
        {sortedTasks.length === 0 ? (
          <p className="text-center text-[#999] py-8 text-sm">
            No tasks yet. Add one to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}

             {tasks.filter(t => !t.completed).length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">
                    No active tasks. Time to relax!
                </div>
            )}
          </div>
        )}
      </div>

       {isAdding ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white border-2 border-black rounded-lg p-4 space-y-3"
        >
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task name..."
            className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-black"
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#666] mb-1">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-black"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

             <div>
              <label className="block text-xs text-[#666] mb-1">Difficulty</label>
              <select
                value={newTask.difficulty}
                onChange={(e) => setNewTask({ ...newTask, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-black"
                style={{
                  backgroundImage: `linear-gradient(to right, ${difficultyColors[newTask.difficulty]} 12px, transparent 12px)`
                }}
              >
                <option value="hard">🔴 Hard</option>
                <option value="medium">🟡 Medium</option>
                <option value="easy">🟢 Easy</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div>
              <label className="block text-xs text-[#666] mb-1">Category</label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-black"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

             <div>
              <label className="block text-xs text-[#666] mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-[#E5E5E5] rounded text-sm focus:outline-none focus:border-black"
              />
            </div>
          </div>

           <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newTask.isHighlight}
                onChange={(e) => setNewTask({ ...newTask, isHighlight: e.target.checked })}
                className="w-4 h-4 border-2 border-black rounded-none cursor-pointer"
              />
              <span className="text-sm">Mark as highlight of the day ★</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newTask.spacedRepetition}
                onChange={(e) => setNewTask({ ...newTask, spacedRepetition: e.target.checked })}
                className="w-4 h-4 border-2 border-black rounded-none cursor-pointer"
              />
              <span className="text-sm text-gray-600">Spaced Repetition (Reviews: +1d, +3d, +7d)</span>
            </label>
          </div>

           <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded text-sm font-medium hover:bg-[#333] transition-colors duration-200"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 border border-black bg-white text-black rounded text-sm font-medium hover:bg-black hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3 border-2 border-dashed border-[#E5E5E5] rounded-lg text-[#666] hover:border-black hover:text-black transition-all duration-200 text-sm font-medium"
        >
          + Add Task
        </button>
      )}
    </div>
  );
}
