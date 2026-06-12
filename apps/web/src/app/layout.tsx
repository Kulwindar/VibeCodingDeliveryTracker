import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DeliveryTracker - Track Your Parcel',
  description: 'Track your parcel delivery status in real-time',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}