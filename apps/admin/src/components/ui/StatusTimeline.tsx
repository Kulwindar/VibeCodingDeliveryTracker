import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getStatusStep, getStatusLabel } from '@deliverytracker/shared';

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

  return (
    <View style={styles.container}>
      {statuses.map((status, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <View key={status.key} style={styles.step}>
            <View
              style={[
                styles.circle,
                (isCompleted || isCurrent) && styles.activeCircle,
              ]}
              testID={`timeline-step-${stepNumber}`}
            >
              <Text style={styles.stepNumber}>
                {isCompleted ? '✓' : stepNumber}
              </Text>
            </View>
            <Text style={styles.label}>{status.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  step: { alignItems: 'center' },
  circle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#8E8E93', justifyContent: 'center', alignItems: 'center' },
  activeCircle: { backgroundColor: '#007AFF' },
  stepNumber: { color: 'white', fontWeight: 'bold' },
  label: { fontSize: 12, marginTop: 5 },
});