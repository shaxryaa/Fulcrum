import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getUserFromToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return await prisma.user.findUnique({ where: { id: decoded.userId } });
  } catch (error) {
    return null;
  }
}

// GET /api/journal - Get recent entries
export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const entries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5 // Last 5 entries
    });

    return NextResponse.json(entries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await prisma.journalEntry.deleteMany({
      where: {
        id: id,
        userId: user.id // Ensure ownership
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// POST /api/journal - Create daily entry
export async function POST(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { wentWell, wentBad, notes } = body;

    // Check if entry exists for today? For now just create new one
    // Ideally we might want to upsert based on date, but simplified for now
    const entry = await prisma.journalEntry.create({
      data: {
        wentWell,
        wentBad,
        notes,
        userId: user.id
      }
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error('Journal error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
