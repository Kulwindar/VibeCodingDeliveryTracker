'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StatusTimeline from '@/components/StatusTimeline';
import StatusBadge from '@/components/ui/StatusBadge';

interface TrackingPageClientProps {
  trackingId: string;
  initialOrder: {
    tracking_id: string;
    customer_name: string;
    status: string;
    updated_at: string;
  } | null;
}

export default function TrackingPageClient({ trackingId, initialOrder }: TrackingPageClientProps) {
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(!initialOrder);

  useEffect(() => {
    if (!order) {
      // Try to fetch from API
      const fetchOrder = async () => {
        try {
          const res = await fetch(`/api/track/${trackingId}`);
          if (res.ok) {
            const data = await res.json();
            setOrder(data);
          }
        } catch {
          // Error will be handled by showing not found
        }
        setLoading(false);
      };
      fetchOrder();
    }
  }, [trackingId, order]);

  useEffect(() => {
    if (order) {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/track/${trackingId}`);
          if (res.ok) {
            const data = await res.json();
            setOrder(data);
          }
        } catch {
          // Fallback polling on WebSocket drop
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [trackingId, order]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-blue-600">DeliveryTracker</h1>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading tracking information...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-blue-600">DeliveryTracker</h1>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl font-bold">!</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">We could not find any order with this tracking ID. Please check and try again.</p>
            <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Track Another Order
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">DeliveryTracker</Link>
          <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">Track Another Package</Link>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{order.customer_name}</h2>
                <p className="text-gray-500">Tracking ID: <span className="font-mono">{order.tracking_id}</span></p>
              </div>
              <StatusBadge status={order.status as 'picked_up' | 'in_transit' | 'delivered'} />
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated: {new Date(order.updated_at).toLocaleString()}
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mb-4">Delivery Progress</h3>
              <StatusTimeline currentStatus={order.status as 'picked_up' | 'in_transit' | 'delivered'} />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.993 1.993 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">Need Help?</h4>
                <p className="text-blue-700 text-sm">
                  Your parcel is being delivered by our local courier partner. 
                  You can track real-time updates or contact support for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 DeliveryTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}