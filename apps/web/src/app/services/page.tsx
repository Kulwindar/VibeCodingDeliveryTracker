import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services - DeliveryTracker',
  description: 'Our parcel delivery services',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">DeliveryTracker</Link>
          <nav className="flex space-x-4">
            <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Admin Panel</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Services</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-blue-600 mb-3">Express Parcel</h2>
            <p className="text-gray-600 mb-4">Fast, door-to-door parcel delivery with real-time tracking. Same-day and next-day delivery available.</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Real-time tracking updates</li>
              <li>• SMS & WhatsApp notifications</li>
              <li>• Insurance coverage</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-blue-600 mb-3">Business Solutions</h2>
            <p className="text-gray-600 mb-4">Bulk shipping with consolidated billing and dedicated account management.</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Volume discounts</li>
              <li>• API integration</li>
              <li>• Custom reporting</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}