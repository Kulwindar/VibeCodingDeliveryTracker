import { OrderStatus } from '../types/order';

const STATUS_ORDER: OrderStatus[] = ['picked_up', 'in_transit', 'delivered'];

export const getStatusStep = (status: OrderStatus): number => {
  return STATUS_ORDER.indexOf(status) + 1;
};

export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    delivered: 'Delivered',
  };
  return labels[status];
};

export const isValidStatusTransition = (from: OrderStatus, to: OrderStatus): boolean => {
  const fromIndex = STATUS_ORDER.indexOf(from);
  const toIndex = STATUS_ORDER.indexOf(to);
  return toIndex === fromIndex + 1;
};

export const getAllStatuses = (): OrderStatus[] => [...STATUS_ORDER];

export const getNextStatus = (current: OrderStatus): OrderStatus | null => {
  const currentIndex = STATUS_ORDER.indexOf(current);
  return currentIndex < STATUS_ORDER.length - 1 ? STATUS_ORDER[currentIndex + 1] : null;
};