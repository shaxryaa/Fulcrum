'use client';

import { useState } from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onAddTask, onToggleTask, onDeleteTask }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('General');
  const [newTaskTime, setNewTaskTime] = useState('30m');

  // Group tasks by priority
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed);
  const mediumPriority = tasks.filter(t => t.priority === 'medium' && !t.completed);
  const lowPriority = tasks.filter(t => t.priority === 'low' && !t.completed);
  const completed = tasks.filter(t => t.completed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      await onAddTask({
        title: newTaskTitle.trim(),
        priority: newTaskPriority,
        category: newTaskCategory,
        timeEstimate: newTaskTime
      });
      setNewTaskTitle('');
      setNewTaskPriority('medium');
      setNewTaskCategory('General');
      setNewTaskTime('30m');
      setIsAdding(false);
    }
  };

  return (
    <section className="min-h-[600px]">
      <h2 className="text-[2rem] font-bold tracking-tight mb-8">Today's Tasks</h2>

      {/* High Priority Tasks */}
      {highPriority.length > 0 && (
        <div className="mb-6">
          {highPriority.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Medium Priority Tasks */}
      {mediumPriority.length > 0 && (
        <div className="mb-6">
          {mediumPriority.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Low Priority Tasks */}
      {lowPriority.length > 0 && (
        <div className="mb-6">
          {lowPriority.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <div className="mb-6">
          {completed.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Add Task Form */}
      {isAdding ? (
        <form onSubmit={handleSubmit} className="border-2 border-black rounded p-6 mb-4 bg-white">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Task title..."
            className="w-full text-lg mb-4 px-3 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-black"
            autoFocus
          />
          <div className="flex gap-4 mb-4">
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="px-3 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-black"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <input
              type="text"
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              placeholder="Category"
              className="px-3 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-black"
            />
            <input
              type="text"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
              placeholder="Time estimate"
              className="px-3 py-2 border border-[#E5E5E5] rounded focus:outline-none focus:border-black w-32"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded transition-all duration-200 hover:bg-[#333]"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-6 py-2 border-2 border-black bg-white text-black rounded transition-all duration-200 hover:bg-black hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-4 px-6 mt-4 border-2 border-black rounded bg-white text-black font-medium text-base flex items-center justify-center gap-2 transition-all duration-200 hover:bg-black hover:text-white hover:-translate-y-0.5 hover:shadow-[0px_2px_4px_rgba(0,0,0,0.05)]"
        >
          <span className="text-xl font-light">+</span>
          <span>Add Task</span>
        </button>
      )}
    </section>
  );
}
