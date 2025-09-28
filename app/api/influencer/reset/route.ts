import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/utils/auth';
import { headers } from 'next/headers';

export async function DELETE(_request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the user's influencer record
    const deleted = await prisma.influencer.deleteMany({
      where: { userId: session.user.id }
    });

    // Also reset the user's role in the profile
    await prisma.profile.update({
      where: { userId: session.user.id },
      data: { role: 'USER' }
    });

    return NextResponse.json({
      success: true,
      message: 'Influencer record deleted successfully',
      deleted: deleted.count
    });
  } catch (error) {
    console.error('Error deleting influencer record:', error);
    return NextResponse.json(
      { error: 'Failed to delete influencer record' },
      { status: 500 }
    );
  }
}
