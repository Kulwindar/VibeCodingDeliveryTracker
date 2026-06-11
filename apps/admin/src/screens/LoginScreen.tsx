import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrderSchema } from '@deliverytracker/shared';

type FormData = { customer_name: string };

export default function LoginScreen() {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(createOrderSchema),
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    // TODO: Implement admin authentication
    Alert.alert('Login', `Welcome, ${data.customer_name}`);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DeliveryTracker Admin</Text>
      <Controller
        control={control}
        name="customer_name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Admin Name"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            accessibilityLabel="admin-name-input"
          />
        )}
      />
      {errors.customer_name && (
        <Text style={styles.error}>{errors.customer_name.message}</Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="login-button"
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, marginBottom: 10, borderRadius: 5 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '600' },
  error: { color: 'red', marginBottom: 10 },
});