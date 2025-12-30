'use client';

export default function TaskItem({ task, onToggle, onDelete }) {
  const difficultyColors = {
    hard: 'bg-[#DC2626]',
    medium: 'bg-[#FBBF24]',
    easy: 'bg-[#10B981]'
  };

  const priorityLabels = {
    high: 'High',
    medium: 'Med',
    low: 'Low'
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(d);
    taskDate.setHours(0, 0, 0, 0);

    if (taskDate.getTime() === today.getTime()) {
      return 'Today';
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (taskDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    }

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex items-center gap-3 py-2 px-3 hover:bg-[#F9F9F9] rounded transition-colors duration-150 group">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => {
          console.log('Checkbox clicked for task:', task.id);
          onToggle(task.id, !task.completed);
        }}
        className="w-4 h-4 border-2 border-black rounded-none cursor-pointer flex-shrink-0 appearance-none transition-all duration-150"
        style={{
          backgroundColor: task.completed ? '#000' : '#fff',
          backgroundImage: task.completed
            ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/%3E%3C/svg%3E\")"
            : 'none',
          backgroundSize: '100% 100%'
        }}
      />

      {/* Task Title */}
      <span
        className={`flex-1 text-sm ${
          task.completed ? 'line-through text-[#999]' : 'text-black'
        }`}
      >
        {task.title}
      </span>

      {/* Highlight Star */}
      {task.isHighlight && (
        <span className="text-yellow-500 text-base">★</span>
      )}

      {/* Priority Badge */}
      <span className="text-xs px-2 py-0.5 border border-black rounded text-black">
        {priorityLabels[task.priority]}
      </span>

      {/* Difficulty Indicator */}
      <div
        className={`w-3 h-3 rounded-full ${difficultyColors[task.difficulty]}`}
        title={`${task.difficulty} difficulty`}
      />

      {/* Due Date */}
      <span className="text-xs text-[#666] min-w-[60px] text-right">
        {formatDate(task.dueDate)}
      </span>

      {/* Delete Button */}
      <button
        onClick={() => {
          console.log('Delete button clicked for task:', task.id);
          onDelete(task.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-[#999] hover:text-red-600 transition-all duration-150 ml-1"
        title="Delete task"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}
