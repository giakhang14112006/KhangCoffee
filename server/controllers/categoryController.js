import pool from '../config/db.js';
import { initialCategories } from './mockData.js';

let localCategories = [...initialCategories];

export const getCategories = async (req, res) => {
  try {
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC, id ASC');
      return res.json(rows);
    }
    return res.json(localCategories);
  } catch (err) {
    console.error('getCategories error:', err);
    return res.json(localCategories);
  }
};

export const createCategory = async (req, res) => {
  const { name, slug, description, image_url, sort_order } = req.body;
  try {
    if (pool) {
      const [result] = await pool.query(
        'INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES (?, ?, ?, ?, ?)',
        [name, slug || name.toLowerCase().replace(/\s+/g, '-'), description, image_url, sort_order || 0]
      );
      return res.status(201).json({ id: result.insertId, name, slug, description, image_url, sort_order });
    }
    const newCategory = {
      id: Date.now(),
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      image_url,
      sort_order: sort_order || 0
    };
    localCategories.push(newCategory);
    return res.status(201).json(newCategory);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, image_url, sort_order } = req.body;
  try {
    if (pool) {
      await pool.query(
        'UPDATE categories SET name=?, slug=?, description=?, image_url=?, sort_order=? WHERE id=?',
        [name, slug, description, image_url, sort_order, id]
      );
      return res.json({ id: Number(id), name, slug, description, image_url, sort_order });
    }
    const idx = localCategories.findIndex(c => c.id === Number(id));
    if (idx !== -1) {
      localCategories[idx] = { ...localCategories[idx], name, slug, description, image_url, sort_order };
      return res.json(localCategories[idx]);
    }
    return res.status(404).json({ message: 'Category not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    if (pool) {
      await pool.query('DELETE FROM categories WHERE id=?', [id]);
      return res.json({ message: 'Deleted successfully' });
    }
    localCategories = localCategories.filter(c => c.id !== Number(id));
    return res.json({ message: 'Deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
