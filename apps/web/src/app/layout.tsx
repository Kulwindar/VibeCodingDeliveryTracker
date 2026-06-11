import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DeliveryTracker - Track Your Parcel',
  description: 'Track your parcel delivery status in real-time',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com" async></script>
        <script dangerouslySetInnerHTML={{
          __html: `tailwind.config = { theme: { extend: {} }, plugins: [], corePlugins: { preflight: true } }`
        }} />
      </head>
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}