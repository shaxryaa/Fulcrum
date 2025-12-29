'use client';

export default function StatsCard({ stats }) {
  return (
    <div className="p-6 border border-[#E5E5E5] rounded bg-white">
      <h3 className="text-lg font-semibold mb-4 tracking-tight">Progress</h3>

      <div className="space-y-0">
        <div className="flex justify-between items-center py-4 border-b border-[#F5F5F5]">
          <span className="text-sm text-[#666]">Tasks Completed Today</span>
          <span className="text-lg font-semibold">
            {stats?.tasksCompletedToday || 0}/{stats?.totalTasksToday || 0}
          </span>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-[#F5F5F5]">
          <span className="text-sm text-[#666]">Current Streak</span>
          <span className="text-lg font-semibold">{stats?.currentStreak || 0} days</span>
        </div>

        <div className="flex justify-between items-center py-4">
          <span className="text-sm text-[#666]">Weekly Goal</span>
          <span className="text-lg font-semibold">
            {stats?.weeklyGoal || 0}/{stats?.weeklyGoalTarget || 25}
          </span>
        </div>
      </div>
    </div>
  );
}
