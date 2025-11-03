import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/utils/auth';
import { headers } from 'next/headers';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';

// Allowed video formats
const ALLOWED_VIDEO_FORMATS = ['mp4', 'mov', 'avi', 'webm'];
const ALLOWED_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
];

// Maximum file size: 500MB
const MAX_FILE_SIZE = 500 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's store (brand)
    const store = await prisma.store.findFirst({
      where: { userId: session.user.id },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, error: 'You must have a store to upload campaign videos' },
        { status: 403 }
      );
    }

    // Parse form data
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const caption: string = (data.get('caption') as string) || '';

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No video file received' },
        { status: 400 }
      );
    }

    // Validate file is a video
    if (!file.type.startsWith('video/')) {
      return NextResponse.json(
        { success: false, error: 'File must be a video' },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid video format. Allowed formats: ${ALLOWED_VIDEO_FORMATS.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate file size (500MB max)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { 
          success: false, 
          error: `File size exceeds 500MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB` 
        },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // Validate file extension
    if (!fileExtension || !ALLOWED_VIDEO_FORMATS.includes(fileExtension)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid file extension. Allowed formats: ${ALLOWED_VIDEO_FORMATS.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const filename = `${store.id}_campaign_video_${timestamp}_${uniqueId}.${fileExtension}`;

    // Create directory structure: /uploads/campaign-videos/
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'campaign-videos');
    
    try {
      const fs = require('fs');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
    } catch (err) {
      console.error('Error creating uploads directory:', err);
      return NextResponse.json(
        { success: false, error: 'Failed to create upload directory' },
        { status: 500 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to disk
    const filePath = join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    // Generate public URL
    const videoUrl = `/uploads/campaign-videos/${filename}`;

    // Return success response with video metadata
    return NextResponse.json({
      success: true,
      message: 'Video uploaded successfully',
      videoUrl,
      videoFileName: file.name,
      videoSize: file.size,
      videoFormat: fileExtension as 'mp4' | 'mov' | 'avi' | 'webm',
      videoCaption: caption,
    }, { status: 200 });

  } catch (error) {
    console.error('Video upload error:', error);
    
    // Clean up file if it was partially uploaded
    // (In production, implement proper cleanup)
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to upload video' 
      },
      { status: 500 }
    );
  }
}
