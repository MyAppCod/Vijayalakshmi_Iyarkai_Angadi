const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const role = require('../middleware/role');
const upload = require('../middleware/upload');

const {
  getContent,
  updateContent
} = require('../controllers/contentController');

// Public
router.get('/:page', getContent);

// Admin
router.post('/', auth, role('admin'),  upload.single('logo'), updateContent);

module.exports = router;