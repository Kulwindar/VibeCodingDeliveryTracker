import { z } from 'zod';
import { OrderStatus } from '@deliverytracker/shared';

export const orderStatusSchema = z.enum(['picked_up', 'in_transit', 'delivered']) as z.ZodType<OrderStatus>;

export const createOrderSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required'),
});

export const updateStatusSchema = z.object({
  status: orderStatusSchema,
});

export const uuidSchema = z.string().uuid('Invalid UUID format');