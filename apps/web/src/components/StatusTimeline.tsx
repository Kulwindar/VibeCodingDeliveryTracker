import { getStatusStep } from '@deliverytracker/shared';

interface StatusTimelineProps {
  currentStatus: 'picked_up' | 'in_transit' | 'delivered';
}

const statuses = [
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'delivered', label: 'Delivered' },
] as const;

export default function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  const currentStep = getStatusStep(currentStatus);

  const statusColors: Record<string, { bg: string; text: string }> = {
    picked_up: { bg: 'bg-green-500', text: 'text-green-500' },
    in_transit: { bg: 'bg-blue-500', text: 'text-blue-500' },
    delivered: { bg: 'bg-purple-500', text: 'text-purple-500' },
  };

  const currentColors = statusColors[currentStatus] || { bg: 'bg-blue-500', text: 'text-blue-500' };

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full" />
        <div
          className={`absolute top-5 left-0 h-1 ${currentColors.bg} rounded-full transition-all duration-500`}
          style={{ width: `${((currentStep - 1) / (statuses.length - 1)) * 100}%` }}
        />

        <div className="flex justify-between relative">
          {statuses.map((status, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            const circleClasses = isCompleted || isCurrent 
              ? `${statusColors[status.key]?.bg || 'bg-blue-500'} text-white` 
              : 'bg-white border-2 border-gray-300 text-gray-400';

            return (
              <div key={status.key} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${circleClasses}`}
                  data-testid={`timeline-step-${stepNumber}`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span className={`text-xs mt-2 font-medium ${isCompleted || isCurrent ? currentColors.text : 'text-gray-500'}`}>
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}