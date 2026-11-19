import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const res = db.resetDemo();
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
