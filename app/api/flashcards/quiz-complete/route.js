import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST /api/flashcards/quiz-complete
// Increment the user's quizzesTaken count
export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const updatedUser = await prisma.user.update({
        where: { id: decoded.userId },
        data: {
            quizzesTaken: { increment: 1 }
        },
        select: { quizzesTaken: true }
    });

    return NextResponse.json({ success: true, quizzesTaken: updatedUser.quizzesTaken });

  } catch (error) {
    console.error('Error incrementing quiz count:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
