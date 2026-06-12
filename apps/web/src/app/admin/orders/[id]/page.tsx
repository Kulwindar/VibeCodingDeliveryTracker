'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getNextStatus, getStatusLabel } from '@deliverytracker/shared';

interface AdminOrderDetailProps {
  params: { id: string };
}

interface Order {
  id: string;
  tracking_id: string;
  customer_name: string;
  status: 'picked_up' | 'in_transit' | 'delivered';
  updated_at: string;
}

export default function AdminOrderDetail({ params }: AdminOrderDetailProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<'picked_up' | 'in_transit' | 'delivered'>('picked_up');
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch('/api/orders?t=' + Date.now(), {
      cache: 'no-cache',
    });
    if (res.ok) {
      const data = await res.json();
      const found = data.orders?.find((o: Order) => o.id === params.id);
      if (found) {
        setOrder(found);
        setStatus(found.status);
      } else {
        setError('Order not found');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [params.id]);

  const handleUpdate = async (newStatus: 'picked_up' | 'in_transit' | 'delivered') => {
    setUpdating(true);

    const res = await fetch(`/api/orders/${order?.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setStatus(newStatus);
      await fetchOrder();
    } else {
      const err = await res.json();
      setError(err.error?.message || 'Failed to update status');
    }

    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <Link href="/admin" className="text-blue-600">Back to Orders</Link>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { key: 'picked_up', label: 'Picked Up' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'delivered', label: 'Delivered' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">DeliveryTracker Admin</h1>
          <Link href="/admin" className="text-sm text-gray-600 hover:text-blue-600">Orders</Link>
        </div>
      </header>

      {error && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">{order.customer_name}</h2>
          <p className="text-gray-600 mb-4 font-mono">Tracking: {order.tracking_id}</p>
          
          <div className="border-t pt-4">
            <p className="font-medium mb-3">Current Status: {getStatusLabel(status)}</p>
            <div className="flex gap-2 mb-4">
              {statusSteps.map((step) => {
                const isCurrent = step.key === status;
                const isPast = ['picked_up', 'in_transit', 'delivered'].indexOf(step.key) < ['picked_up', 'in_transit', 'delivered'].indexOf(status);
                const isNext = step.key === getNextStatus(status);
                
                return (
                  <button
                    key={step.key}
                    onClick={() => handleUpdate(step.key as any)}
                    disabled={!isNext && !isCurrent}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      isCurrent ? 'bg-blue-600 text-white' :
                      isPast ? 'bg-gray-200 text-gray-600' :
                      isNext ? 'bg-green-600 text-white hover:bg-green-700' :
                      'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isNext && updating ? (
                      <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : step.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-700">View customer tracking: <Link href={`/track/${order.tracking_id}`} className="underline">/track/{order.tracking_id}</Link></p>
        </div>
      </main>
    </div>
  );
}