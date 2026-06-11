import TrackingPageClient from './TrackingPageClient';
import { supabase } from '@/lib/supabase';

interface TrackingPageProps {
  params: { trackingId: string };
}

export default async function TrackingPage({ params }: TrackingPageProps) {
  const { trackingId } = params;

  // Demo tracking ID for testing
  if (trackingId === 'demo-tracking-123') {
    return <TrackingPageClient trackingId={trackingId} initialOrder={{
      tracking_id: 'demo-tracking-123',
      customer_name: 'Rahul Mehta',
      status: 'in_transit',
      updated_at: new Date().toISOString(),
    }} />;
  }

  const { data, error } = await supabase
    .from('orders')
    .select('tracking_id, customer_name, status, updated_at')
    .eq('tracking_id', trackingId)
    .single();

  if (error || !data) {
    return <TrackingPageClient trackingId={trackingId} initialOrder={null} />;
  }

  return <TrackingPageClient trackingId={trackingId} initialOrder={data} />;
}