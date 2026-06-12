// Shared demo storage with global singleton for Next.js dev mode
declare global {
  var __demoOrders: Array<{
    id: string;
    tracking_id: string;
    customer_name: string;
    status: 'picked_up' | 'in_transit' | 'delivered';
    created_at: string;
    updated_at: string;
  }> | undefined;
}

const initialOrders = [
  { id: '1', tracking_id: 'demo-tracking-123', customer_name: 'Rahul Mehta', status: 'in_transit', created_at: '2026-06-10', updated_at: new Date().toISOString() },
  { id: '2', tracking_id: 'uuid-2', customer_name: 'Priya Sharma', status: 'picked_up', created_at: '2026-06-10', updated_at: '2026-06-10' },
];

export const demoOrders: Array<{
  id: string;
  tracking_id: string;
  customer_name: string;
  status: 'picked_up' | 'in_transit' | 'delivered';
  created_at: string;
  updated_at: string;
}> = global.__demoOrders || initialOrders;

// Keep in sync
if (!global.__demoOrders) {
  global.__demoOrders = demoOrders;
}

export const findOrderById = (id: string) => demoOrders.find(o => o.id === id || o.tracking_id === id);
export const findOrderByTrackingId = (trackingId: string) => demoOrders.find(o => o.tracking_id === trackingId);
export const addOrder = (order: typeof demoOrders[0]) => { 
  demoOrders.unshift(order); 
  return order; 
};
export const updateOrderStatus = (id: string, status: 'picked_up' | 'in_transit' | 'delivered') => {
  const order = demoOrders.find(o => o.id === id);
  if (order) { 
    order.status = status; 
    order.updated_at = new Date().toISOString(); 
  }
  return order;
};
export const getAllOrders = () => [...demoOrders];
export const getOrderById = findOrderById;
export const getOrderByTrackingId = findOrderByTrackingId;