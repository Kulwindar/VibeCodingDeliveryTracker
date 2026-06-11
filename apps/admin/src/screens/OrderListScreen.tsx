import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Order } from '@deliverytracker/shared';

interface OrderListScreenProps {
  navigation: { navigate: (screen: string, params?: unknown) => void };
}

const mockOrders: Order[] = [
  { id: '1', tracking_id: 'uuid-1', customer_name: 'Rahul Mehta', status: 'picked_up', created_at: '2026-06-10', updated_at: '2026-06-10' },
  { id: '2', tracking_id: 'uuid-2', customer_name: 'Priya Sharma', status: 'in_transit', created_at: '2026-06-10', updated_at: '2026-06-10' },
];

export default function OrderListScreen({ navigation }: OrderListScreenProps) {
  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
      accessibilityRole="button"
      accessibilityLabel={`order-${item.id}-button`}
      testID={`order-card-${item.id}`}
    >
      <View style={styles.cardContent}>
        <Text style={styles.customerName}>{item.customer_name}</Text>
        <Text style={styles.trackingId}>ID: {item.tracking_id}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <FlatList
        data={mockOrders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        testID="order-list"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  cardContent: {},
  customerName: { fontSize: 16, fontWeight: '600' },
  trackingId: { fontSize: 12, color: '#666' },
  status: { fontSize: 14, marginTop: 5 },
});