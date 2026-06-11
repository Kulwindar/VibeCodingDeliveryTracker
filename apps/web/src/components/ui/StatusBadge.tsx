import { OrderStatus } from '@deliverytracker/shared';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  picked_up: { 
    bg: 'bg-green-100', 
    text: 'text-green-800', 
    label: 'Picked Up' 
  },
  in_transit: { 
    bg: 'bg-blue-100', 
    text: 'text-blue-800', 
    label: 'In Transit' 
  },
  delivered: { 
    bg: 'bg-purple-100', 
    text: 'text-purple-800', 
    label: 'Delivered' 
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.picked_up;

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      data-testid="status-badge"
    >
      {config.label}
    </span>
  );
}