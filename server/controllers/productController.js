import pool from '../config/db.js';
import { initialProducts } from './mockData.js';

let localProducts = [...initialProducts];

export const getProducts = async (req, res) => {
  const { category_id, featured } = req.query;
  try {
    if (pool) {
      let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
      const params = [];
      if (category_id) {
        query += ' AND p.category_id = ?';
        params.push(category_id);
      }
      if (featured) {
        query += ' AND p.is_featured = 1';
      }
      query += ' ORDER BY p.id DESC';
      const [rows] = await pool.query(query, params);
      return res.json(rows);
    }
    let list = [...localProducts];
    if (category_id) {
      list = list.filter(p => p.category_id === Number(category_id));
    }
    if (featured) {
      list = list.filter(p => p.is_featured === 1);
    }
    return res.json(list);
  } catch (err) {
    console.error('getProducts error:', err);
    return res.json(localProducts);
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    if (pool) {
      const [rows] = await pool.query('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [id]);
      if (rows.length > 0) return res.json(rows[0]);
      return res.status(404).json({ message: 'Product not found' });
    }
    const item = localProducts.find(p => p.id === Number(id));
    if (item) return res.json(item);
    return res.status(404).json({ message: 'Product not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  const { category_id, name, slug, description, price, image_url, is_featured, is_available } = req.body;
  try {
    if (pool) {
      const [result] = await pool.query(
        'INSERT INTO products (category_id, name, slug, description, price, image_url, is_featured, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [category_id, name, slug || name.toLowerCase().replace(/\s+/g, '-'), description, price, image_url, is_featured ? 1 : 0, is_available !== undefined ? (is_available ? 1 : 0) : 1]
      );
      return res.status(201).json({ id: result.insertId, ...req.body });
    }
    const newProduct = {
      id: Date.now(),
      category_id: Number(category_id),
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      price: Number(price),
      image_url,
      is_featured: is_featured ? 1 : 0,
      is_available: is_available !== undefined ? (is_available ? 1 : 0) : 1
    };
    localProducts.unshift(newProduct);
    return res.status(201).json(newProduct);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { category_id, name, slug, description, price, image_url, is_featured, is_available } = req.body;
  try {
    if (pool) {
      await pool.query(
        'UPDATE products SET category_id=?, name=?, slug=?, description=?, price=?, image_url=?, is_featured=?, is_available=? WHERE id=?',
        [category_id, name, slug, description, price, image_url, is_featured ? 1 : 0, is_available ? 1 : 0, id]
      );
      return res.json({ id: Number(id), ...req.body });
    }
    const idx = localProducts.findIndex(p => p.id === Number(id));
    if (idx !== -1) {
      localProducts[idx] = {
        ...localProducts[idx],
        category_id: Number(category_id),
        name,
        slug,
        description,
        price: Number(price),
        image_url,
        is_featured: is_featured ? 1 : 0,
        is_available: is_available ? 1 : 0
      };
      return res.json(localProducts[idx]);
    }
    return res.status(404).json({ message: 'Product not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    if (pool) {
      await pool.query('DELETE FROM products WHERE id=?', [id]);
      return res.json({ message: 'Product deleted' });
    }
    localProducts = localProducts.filter(p => p.id !== Number(id));
    return res.json({ message: 'Product deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
