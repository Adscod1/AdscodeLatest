import { NextRequest, NextResponse } from 'next/server';
import { createService, getServicesByStore, CreateServiceInput } from '@/actions/service';
import { auth } from '@/utils/auth';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const serviceData: CreateServiceInput = {
      ...body,
      images: body.media?.filter((m: any) => m.type.startsWith('image/')).map((m: any) => ({ url: m.url })) || [],
      videos: body.media?.filter((m: any) => m.type.startsWith('video/')).map((m: any) => ({ url: m.url })) || [],
    };

    const service = await createService(serviceData);

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      service
    });

  } catch (error) {
    console.error('Service creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create service' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    const services = await getServicesByStore(storeId);

    return NextResponse.json({
      success: true,
      services
    });

  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
