import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { SwipeAction } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, action } = body;

    if (!profileId || typeof profileId !== 'string') {
      return NextResponse.json(
        { success: false, matched: false, message: 'profileId is required and must be a string' },
        { status: 400 }
      );
    }

    if (!action || (action !== 'like' && action !== 'pass')) {
      return NextResponse.json(
        { success: false, matched: false, message: 'action must be either "like" or "pass"' },
        { status: 400 }
      );
    }

    const result = db.recordSwipe(profileId, action as SwipeAction);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error processing swipe:', error);
    return NextResponse.json(
      { success: false, matched: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
