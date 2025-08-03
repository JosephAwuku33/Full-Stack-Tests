import { z } from 'zod';

export const checkoutSchema = z.object({
  shippingAddress: z.string().min(5),
  paymentMethod: z.enum(['credit_card', 'mobile_money', 'cash_on_delivery']),
});
