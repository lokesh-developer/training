const express = require('express');

const router = express.Router();

// Import controllers
const { createPost } = require('../controllers/posts');

// Routes
router.post('/create-post', createPost);

module.exports = router;
