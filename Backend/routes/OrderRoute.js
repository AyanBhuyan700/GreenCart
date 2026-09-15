import express from 'express';
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js';
import { placeOrder, userOrders, allOrders, updateStatus } from '../controllers/OrderController.js';

const orderRoute = express.Router();

// User features
orderRoute.post('/place', AuthMiddleware, placeOrder);
orderRoute.get('/userorders', AuthMiddleware, userOrders);

// Admin features
orderRoute.get('/list', allOrders);
orderRoute.post('/status', updateStatus);

export default orderRoute;
