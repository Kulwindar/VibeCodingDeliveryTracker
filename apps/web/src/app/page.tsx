'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setLoading(true);
      router.push(`/track/${trackingId.trim()}`);
    }
  };

  const stats = [
    { count: '10M+', label: 'Parcels Delivered' },
    { count: '99.5%', label: 'On-Time Delivery' },
    { count: '24/7', label: 'Customer Support' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">DeliveryTracker</Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600">Home</Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600">Services</Link>
            <Link href="#" className="text-gray-600 hover:text-blue-600">Support</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Your Parcel in Real-Time</h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">Get instant updates on your delivery status</p>
            
            <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="tracking_id" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Enter Tracking ID
                  </label>
                  <input
                    type="text"
                    id="tracking_id"
                    placeholder="e.g., demo-tracking-123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Tracking...
                    </>
                  ) : 'Track My Parcel'}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-3">Demo tracking ID: <span className="font-mono bg-gray-100 px-1 rounded">demo-tracking-123</span></p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">Why Choose DeliveryTracker?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{stat.count}</div>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 DeliveryTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}