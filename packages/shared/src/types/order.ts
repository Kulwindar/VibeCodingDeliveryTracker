export type OrderStatus = 'picked_up' | 'in_transit' | 'delivered';

export interface Order {
  id: string;
  tracking_id: string;
  customer_name: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  customer_name: string;
}

export interface CreateOrderResponse {
  id: string;
  tracking_id: string;
  tracking_url: string;
  customer_name: string;
  status: OrderStatus;
  created_at: string;
}

export interface UpdateStatusRequest {
  status: OrderStatus;
}

export interface UpdateStatusResponse {
  id: string;
  status: OrderStatus;
  updated_at: string;
}

export interface TrackOrderResponse {
  tracking_id: string;
  customer_name: string;
  status: OrderStatus;
  updated_at: string;
}

export interface OrdersListResponse {
  orders: Order[];
  total: number;
}