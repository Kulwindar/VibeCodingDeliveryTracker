import TrackingPageClient from './TrackingPageClient';
import { supabase, isDemoMode } from '@/lib/supabase';
import { getOrderByTrackingId } from '@/lib/demo-storage';

interface TrackingPageProps {
  params: { trackingId: string };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { trackingId } = params;

  if (isDemoMode() || trackingId === 'demo-tracking-123') {
    const order = getOrderByTrackingId(trackingId);
    if (!order) {
      return <TrackingPageClient trackingId={trackingId} initialOrder={null} />;
    }
    return <TrackingPageClient trackingId={trackingId} initialOrder={{
      tracking_id: order.tracking_id,
      customer_name: order.customer_name,
      status: order.status,
      updated_at: order.updated_at,
    }} />;
  }

  const { data, error } = await supabase!
    .from('orders')
    .select('tracking_id, customer_name, status, updated_at')
    .eq('tracking_id', trackingId)
    .single();

  if (error || !data) {
    return <TrackingPageClient trackingId={trackingId} initialOrder={null} />;
  }

  return <TrackingPageClient trackingId={trackingId} initialOrder={data} />;
}