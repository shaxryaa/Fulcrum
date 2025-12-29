'use client';

import { useState } from 'react';

export default function TaskItem({ task, onToggle, onDelete }) {
  const [isHovered, setIsHovered] = useState(false);

  const priorityStyles = {
    high: 'font-semibold border-black',
    medium: 'font-medium border-black',
    low: 'font-normal text-[#666] border-[#666]'
  };

  return (
    <div
      className={`flex items-start p-5 px-[30px] border border-[#E5E5E5] rounded mb-4 transition-all duration-200 ${
        isHovered ? 'bg-[#F9F9F9] -translate-y-px shadow-[0px_2px_4px_rgba(0,0,0,0.05)]' : 'bg-white'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Custom Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id, !task.completed)}
        className="task-checkbox w-5 h-5 border-2 border-black rounded-none mr-6 mt-0.5 cursor-pointer flex-shrink-0 transition-transform duration-200 hover:scale-110 appearance-none"
        style={{
          backgroundColor: task.completed ? '#000' : '#fff',
          backgroundImage: task.completed
            ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/%3E%3C/svg%3E\")"
            : 'none',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Task Content */}
      <label className="flex-1 cursor-pointer">
        <div className="flex flex-col gap-2">
          <span
            className={`text-lg leading-relaxed transition-colors duration-200 ${
              task.completed ? 'line-through text-[#666]' : 'text-black'
            }`}
          >
            {task.title}
          </span>

          {/* Task Metadata */}
          <div className="flex items-center gap-4 flex-wrap">
            {/* Priority Tag */}
            <span
              className={`text-sm px-3 py-1 rounded border ${priorityStyles[task.priority]}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>

            {/* Category Tag */}
            <span className="text-sm px-3 py-1 rounded-xl border border-black bg-white">
              {task.category}
            </span>

            {/* Time Estimate */}
            <span className="text-sm text-[#666] ml-auto">{task.timeEstimate}</span>
          </div>
        </div>
      </label>
    </div>
  );
}
