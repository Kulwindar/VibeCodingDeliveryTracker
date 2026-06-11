import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getNextStatus } from '@deliverytracker/shared';
import type { OrderStatus } from '@deliverytracker/shared';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const { status }: { status: OrderStatus } = body;

  const { data: currentOrder, error: fetchError } = await supabase
    .from('orders')
    .select('status')
    .eq('id', id)
    .single();

  if (fetchError || !currentOrder) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Order not found' } },
      { status: 404 }
    );
  }

  const nextValidStatus = getNextStatus(currentOrder.status as OrderStatus);
  if (status !== nextValidStatus) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_TRANSITION',
          message: `Cannot move from '${currentOrder.status}' to '${status}'`,
        },
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: { code: 'DATABASE_ERROR', message: 'Failed to update status' } },
      { status: 500 }
    );
  }

  return NextResponse.json({
    id: data.id,
    status: data.status,
    updated_at: data.updated_at,
  });
}