import express from 'express';
import * as authController from '../controllers/auth.controller';
import * as productController from '../controllers/product.controller';
import * as cartController from '../controllers/cart.controller';
import * as orderController from '../controllers/order.controller';
import * as farmerController from '../controllers/farmer.controller';
import * as customerController from '../controllers/customer.controller';
import { validateBody } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/auth';
import { createProductSchema, updateProductSchema } from '../validators/product';
import { addToCartSchema } from '../validators/cart';
import { checkoutSchema } from '../validators/checkout';
import { authenticate, requireRole } from '../middleware/auth';

const router = express.Router();

// Auth
router.post('/auth/register', validateBody(registerSchema), authController.register);
router.post('/auth/login', validateBody(loginSchema), authController.login);

// Public products
router.get('/products', productController.listProducts);
router.get('/products/:id', productController.getProduct);

// Farmer protected
router.use('/farmer', authenticate, requireRole('farmer'));
router.get('/farmer/dashboard', farmerController.getFarmerOverview);
router.post('/farmer/products', validateBody(createProductSchema), productController.createProduct);
router.put('/farmer/products/:id', validateBody(updateProductSchema), productController.updateProduct);
router.delete('/farmer/products/:id', productController.deleteProduct);

// Customer protected
router.use('/customer', authenticate, requireRole('customer'));
router.get('/customer/dashboard', customerController.getCustomerOverview);
router.get('/customer/cart', cartController.getCart);
router.post('/customer/cart/items', validateBody(addToCartSchema), cartController.addToCart);
router.delete('/customer/cart/items/:productId', cartController.removeFromCart);
router.post('/customer/checkout', validateBody(checkoutSchema), orderController.checkout);
router.get('/customer/orders', orderController.getCustomerOrders);
router.get('/customer/orders/:id', orderController.getOrderById);

// Shared order view (customer/farmer) with authentication
router.get('/orders/:id', authenticate, orderController.getOrderById);

export default router;
