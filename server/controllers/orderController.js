import pool from '../config/db.js';
import { initialOrders } from './mockData.js';

let localOrders = [...initialOrders];

export const getOrders = async (req, res) => {
  const { status } = req.query;
  try {
    if (pool) {
      let query = 'SELECT * FROM orders';
      const params = [];
      if (status) {
        query += ' WHERE status = ?';
        params.push(status);
      }
      query += ' ORDER BY id DESC';
      const [orders] = await pool.query(query, params);

      for (let order of orders) {
        const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        order.items = items;
      }
      return res.json(orders);
    }
    let list = [...localOrders];
    if (status) {
      list = list.filter(o => o.status === status);
    }
    return res.json(list);
  } catch (err) {
    console.error('getOrders error:', err);
    return res.json(localOrders);
  }
};

export const createOrder = async (req, res) => {
  const { order_type, table_number, customer_name, customer_phone, delivery_address, note, payment_method, items, total_amount } = req.body;
  const order_code = 'KC-' + Math.floor(1000 + Math.random() * 9000);

  try {
    if (pool) {
      const [result] = await pool.query(
        'INSERT INTO orders (order_code, order_type, table_number, customer_name, customer_phone, delivery_address, note, total_amount, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [order_code, order_type || 'delivery', table_number || null, customer_name, customer_phone, delivery_address || null, note || '', total_amount, payment_method || 'cash', 'pending']
      );

      const orderId = result.insertId;
      if (items && items.length > 0) {
        for (let item of items) {
          await pool.query(
            'INSERT INTO order_items (order_id, product_id, product_name, price, quantity, options, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [orderId, item.product_id || null, item.name || item.product_name, item.price, item.quantity, item.options || '', item.price * item.quantity]
          );
        }
      }

      if (table_number && pool) {
        await pool.query('UPDATE tables SET status="occupied" WHERE table_number=?', [table_number]);
      }

      return res.status(201).json({
        id: orderId,
        order_code,
        order_type: order_type || 'delivery',
        table_number: table_number || null,
        customer_name,
        customer_phone,
        delivery_address: delivery_address || null,
        note: note || '',
        total_amount: Number(total_amount),
        payment_method: payment_method || 'cash',
        status: 'pending',
        items: items || []
      });
    }

    const newOrder = {
      id: Date.now(),
      order_code,
      order_type: order_type || 'delivery',
      table_number: table_number || null,
      customer_name,
      customer_phone,
      delivery_address: delivery_address || null,
      note: note || '',
      total_amount,
      payment_method: payment_method || 'cash',
      status: 'pending',
      created_at: new Date().toISOString(),
      items: items ? items.map((it, idx) => ({
        id: idx + 1,
        product_name: it.name || it.product_name,
        price: it.price,
        quantity: it.quantity,
        options: it.options || '',
        subtotal: it.price * it.quantity
      })) : []
    };

    localOrders.unshift(newOrder);
    return res.status(201).json(newOrder);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    if (pool) {
      await pool.query('UPDATE orders SET status=? WHERE id=?', [status, id]);
      return res.json({ id: Number(id), status });
    }
    const idx = localOrders.findIndex(o => o.id === Number(id));
    if (idx !== -1) {
      localOrders[idx].status = status;
      return res.json(localOrders[idx]);
    }
    return res.status(404).json({ message: 'Order not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
