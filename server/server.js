import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import categoryRoutes from './routes/categories.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import tableRoutes from './routes/tables.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'KhangCoffee API Server is running smoothly' });
});

app.listen(PORT, () => {
  console.log(`🚀 KhangCoffee Server is running on port ${PORT}`);
});
