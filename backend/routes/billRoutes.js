const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const role    = require('../middleware/role');
const { createBill, getBills, getBillById } = require('../controllers/billController');

router.post('/',     auth, role('admin', 'manager', 'staff'), createBill);
router.get('/',      auth, role('admin', 'manager', 'staff'), getBills);
router.get('/:id',   auth, role('admin', 'manager', 'staff'), getBillById);

module.exports = router;
