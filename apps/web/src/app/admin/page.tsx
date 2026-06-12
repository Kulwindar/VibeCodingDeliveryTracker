'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  tracking_id: string;
  customer_name: string;
  status: 'picked_up' | 'in_transit' | 'delivered';
  updated_at: string;
}

export default function AdminPage() {
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders?t=' + Date.now(), {
          cache: 'no-cache',
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch {
        setError('Failed to load orders');
      }
    };
    fetchOrders();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer_name: customerName.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrders([data, ...orders]);
        setCustomerName('');
      } else {
        const err = await res.json();
        setError(err.error?.message || 'Failed to create order');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600">DeliveryTracker Admin</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Order</h2>
          <form onSubmit={handleCreateOrder} className="flex gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              Create Order
            </button>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{order.customer_name}</p>
                    <p className="text-sm text-gray-600 font-mono">{order.tracking_id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-100 px-2 py-1 rounded">{order.status.replace('_', ' ')}</span>
                    <Link href={`/admin/orders/${order.id}`} className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Update Status
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}