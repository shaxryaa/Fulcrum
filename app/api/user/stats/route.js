import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT and get user
async function getUserFromToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    return user;
  } catch (error) {
    return null;
  }
}

// GET /api/user/stats - Get user statistics
export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get tasks completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tasksCompletedToday = await prisma.task.count({
      where: {
        userId: user.id,
        completed: true,
        updatedAt: {
          gte: today
        }
      }
    });

    const totalTasksToday = await prisma.task.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: today
        }
      }
    });

    // Get weekly goal (tasks completed this week)
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const tasksCompletedThisWeek = await prisma.task.count({
      where: {
        userId: user.id,
        completed: true,
        updatedAt: {
          gte: weekStart
        }
      }
    });

    return NextResponse.json({
      tasksCompletedToday,
      totalTasksToday,
      currentStreak: user.currentStreak,
      weeklyGoal: tasksCompletedThisWeek,
      weeklyGoalTarget: 25
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
