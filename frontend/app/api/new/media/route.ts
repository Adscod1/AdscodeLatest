import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/utils/auth';
import { headers } from 'next/headers';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const type: string = data.get('type') as string || 'image'; // 'logo', 'banner', 'gallery', 'video'

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    // Validate file type
    if (type === 'video') {
      if (!file.type.startsWith('video/')) {
        return NextResponse.json({ error: 'Invalid video file type' }, { status: 400 });
      }
    } else {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Invalid image file type' }, { status: 400 });
      }
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `${session.user.id}_${type}_${timestamp}.${fileExtension}`;

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      const fs = require('fs');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
    } catch (err) {
      console.error('Error creating uploads directory:', err);
    }

    // Save file
    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    // Return the public URL
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      url: fileUrl,
      filename,
      type,
      size: file.size
    });

  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload media files' },
      { status: 500 }
    );
  }
}
