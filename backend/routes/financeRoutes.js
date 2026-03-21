const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const role    = require('../middleware/role');
const { createEntry, getEntries, deleteEntry, getSummary } = require('../controllers/financeController');

router.get('/summary', auth, role('admin', 'manager'), getSummary);
router.get('/',        auth, role('admin', 'manager'), getEntries);
router.post('/',       auth, role('admin', 'manager'), createEntry);
router.delete('/:id',  auth, role('admin'),            deleteEntry);

module.exports = router;
