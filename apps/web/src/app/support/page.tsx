import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Support - DeliveryTracker',
  description: 'Customer support and help center',
};

export default function SupportPage() {
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Customer Support</h1>
        
        <div className="bg-white rounded-xl p-8 shadow-lg mb-6">
          <h2 className="text-xl font-bold text-blue-600 mb-4">Contact Us</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-700">Phone Support</p>
              <p className="text-gray-600">+1 (800) 555-0123</p>
              <p className="text-sm text-gray-500">Mon-Fri: 8AM - 8PM, Sat: 9AM - 5PM</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Email Support</p>
              <p className="text-gray-600">support@deliverytracker.app</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-blue-600 mb-4">FAQs</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-700">How do I track my parcel?</p>
              <p className="text-gray-600 text-sm">Enter your tracking ID on the homepage to see real-time status updates.</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">What does each status mean?</p>
              <p className="text-gray-600 text-sm">Picked Up → In Transit → Delivered (forward-only progression)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}