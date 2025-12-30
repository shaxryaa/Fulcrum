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

export async function GET(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const areas = await prisma.lifeArea.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(areas);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getUserFromToken(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { name, rating, id } = body;

    if (id) {
        // Update existing
        const updated = await prisma.lifeArea.update({
            where: { id },
            data: { rating: parseInt(rating), name }
        });
        return NextResponse.json(updated);
    } else {
        // Create new
        const created = await prisma.lifeArea.create({
            data: {
                name,
                rating: parseInt(rating),
                userId: user.id
            }
        });
        return NextResponse.json(created);
    }
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
  
      await prisma.lifeArea.deleteMany({ where: { id, userId: user.id } });
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
