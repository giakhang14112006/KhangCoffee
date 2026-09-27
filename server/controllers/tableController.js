import pool from '../config/db.js';
import { initialTables } from './mockData.js';

let localTables = [...initialTables];

export const getTables = async (req, res) => {
  try {
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM tables ORDER BY table_number ASC');
      return res.json(rows);
    }
    return res.json(localTables);
  } catch (err) {
    console.error('getTables error:', err);
    return res.json(localTables);
  }
};

export const updateTableStatus = async (req, res) => {
  const { id } = req.params;
  const { status, seating_capacity } = req.body;
  try {
    if (pool) {
      await pool.query('UPDATE tables SET status=?, seating_capacity=? WHERE id=?', [status, seating_capacity || 4, id]);
      return res.json({ id: Number(id), status });
    }
    const idx = localTables.findIndex(t => t.id === Number(id));
    if (idx !== -1) {
      localTables[idx].status = status;
      if (seating_capacity) localTables[idx].seating_capacity = seating_capacity;
      return res.json(localTables[idx]);
    }
    return res.status(404).json({ message: 'Table not found' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const createTable = async (req, res) => {
  const { table_number, seating_capacity } = req.body;
  try {
    if (pool) {
      const [result] = await pool.query('INSERT INTO tables (table_number, seating_capacity, status) VALUES (?, ?, ?)', [table_number, seating_capacity || 4, 'available']);
      return res.status(201).json({ id: result.insertId, table_number, seating_capacity, status: 'available' });
    }
    const newTable = {
      id: Date.now(),
      table_number,
      seating_capacity: seating_capacity || 4,
      status: 'available'
    };
    localTables.push(newTable);
    return res.status(201).json(newTable);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteTable = async (req, res) => {
  const { id } = req.params;
  try {
    if (pool) {
      await pool.query('DELETE FROM tables WHERE id=?', [id]);
      return res.json({ message: 'Table deleted' });
    }
    localTables = localTables.filter(t => t.id !== Number(id));
    return res.json({ message: 'Table deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
