import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createOrderSchema } from '@/lib/validators';
import { OrderStatus } from '@deliverytracker/shared';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createOrderSchema.parse(body);

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: validated.customer_name,
        status: 'picked_up' as OrderStatus,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to create order' } },
        { status: 500 }
      );
    }

    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/track/${data.tracking_id}`;

    return NextResponse.json(
      {
        id: data.id,
        tracking_id: data.tracking_id,
        tracking_url: trackingUrl,
        customer_name: data.customer_name,
        status: data.status,
        created_at: data.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'VALIDATION_ERROR', message: 'Invalid request body' } },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch orders' } },
      { status: 500 }
    );
  }

  return NextResponse.json({
    orders: data,
    total: data.length,
  });
}