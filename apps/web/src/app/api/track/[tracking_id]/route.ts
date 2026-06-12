import { NextRequest, NextResponse } from 'next/server';
import { supabase, isDemoMode } from '@/lib/supabase';
import { demoOrders, findOrderByTrackingId } from '@/lib/demo-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { tracking_id: string } }
) {
  const { tracking_id } = params;

  if (isDemoMode()) {
    const order = findOrderByTrackingId(tracking_id);
    if (!order) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Order not found.' } }, { status: 404 });
    }
    return NextResponse.json({
      tracking_id: order.tracking_id,
      customer_name: order.customer_name,
      status: order.status,
      updated_at: order.updated_at,
    });
  }

  const { data, error } = await supabase!
    .from('orders')
    .select('tracking_id, customer_name, status, updated_at')
    .eq('tracking_id', tracking_id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Order not found.' } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    tracking_id: data.tracking_id,
    customer_name: data.customer_name,
    status: data.status,
    updated_at: data.updated_at,
  });
}