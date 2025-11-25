import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/utils/auth';
import { headers } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received');

    // Get the current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log('Session check:', session?.user ? 'Authenticated' : 'Not authenticated');

    if (!session || !session.user) {
      console.error('Unauthorized upload attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('File received:', file?.name, 'Size:', file?.size, 'Type:', file?.type);

    if (!file) {
      console.error('No file in request');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (5MB for images, 50MB for videos)
    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    
    if (file.size > maxSize) {
      console.error('File too large:', file.size, 'Max:', maxSize);
      return NextResponse.json(
        { error: `File too large. Max size is ${isVideo ? '50MB' : '5MB'}` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Only images and videos are allowed' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    console.log('Generated filename:', filename);

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'reviews');
    if (!existsSync(uploadDir)) {
      console.log('Creating upload directory:', uploadDir);
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const filepath = join(uploadDir, filename);
    console.log('Saving file to:', filepath);
    await writeFile(filepath, buffer);

    // Return public URL
    const publicUrl = `/uploads/reviews/${filename}`;
    console.log('File uploaded successfully:', publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl
    });

  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload media' },
      { status: 500 }
    );
  }
}
