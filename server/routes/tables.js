import express from 'express';
import { getTables, createTable, updateTableStatus, deleteTable } from '../controllers/tableController.js';

const router = express.Router();

router.get('/', getTables);
router.post('/', createTable);
router.put('/:id', updateTableStatus);
router.delete('/:id', deleteTable);

export default router;
