import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { tracking_id: string } }
) {
  const { tracking_id } = params;

  // Demo tracking ID for testing
  if (tracking_id === 'demo-tracking-123') {
    return NextResponse.json({
      tracking_id: 'demo-tracking-123',
      customer_name: 'Rahul Mehta',
      status: 'in_transit',
      updated_at: new Date().toISOString(),
    });
  }

  const { data, error } = await supabase
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