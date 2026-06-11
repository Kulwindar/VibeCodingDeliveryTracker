import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import { Order, getNextStatus, getStatusLabel } from '@deliverytracker/shared';

interface OrderDetailScreenProps {
  route: { params: { orderId: string } };
}

const mockOrder: Order = {
  id: '1',
  tracking_id: '550e8400-e29b-41d4-a716-446655440000',
  customer_name: 'Rahul Mehta',
  status: 'picked_up',
  created_at: '2026-06-10',
  updated_at: '2026-06-10',
};

export default function OrderDetailScreen({ route }: OrderDetailScreenProps) {
  const [order, setOrder] = useState(mockOrder);

  const statuses = [
    { key: 'picked_up', label: 'Picked Up' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'delivered', label: 'Delivered' },
  ] as const;

  const handleStatusUpdate = (newStatus: typeof order.status) => {
    setOrder({ ...order, status: newStatus });
  };

  const handleShare = async () => {
    const url = `https://deliverytracker.app/track/${order.tracking_id}`;
    try {
      await Share.share({ message: url });
    } catch {
      Alert.alert('Error', 'Failed to share tracking link');
    }
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.customerName}>{order.customer_name}</Text>
        <Text style={styles.status}>Current: {getStatusLabel(order.status)}</Text>
      </View>

      <View style={styles.statusContainer}>
        {statuses.map((status) => {
          const isPast = statuses.findIndex(s => s.key === order.status) > statuses.findIndex(s => s.key === status.key);
          const isCurrent = status.key === order.status;

          return (
            <TouchableOpacity
              key={status.key}
              style={[
                styles.statusButton,
                isCurrent && styles.currentStatus,
                isPast && styles.pastStatus,
              ]}
              onPress={() => handleStatusUpdate(status.key as typeof order.status)}
              disabled={isPast || isCurrent}
              accessibilityRole="button"
              accessibilityLabel={status.key}
              testID={`status-button-${status.key}`}
            >
              <Text style={styles.statusButtonText}>{status.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShare}
        accessibilityRole="button"
        accessibilityLabel="share-tracking-link"
        testID="share-button"
      >
        <Text style={styles.shareButtonText}>Share Tracking Link</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 8, marginBottom: 20 },
  customerName: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  status: { fontSize: 16, color: '#666' },
  statusContainer: { gap: 10 },
  statusButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center' },
  currentStatus: { backgroundColor: '#34C759' },
  pastStatus: { backgroundColor: '#8E8E93' },
  futureStatus: { backgroundColor: '#007AFF' },
  statusButtonText: { color: 'white', fontWeight: '600' },
  shareButton: { backgroundColor: '#FF9500', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  shareButtonText: { color: 'white', fontWeight: '600' },
});

