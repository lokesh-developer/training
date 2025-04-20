const express = require('express');
const router = express.Router();

// Import controllers
const { login, signup } = require('../controllers/auth');

// Routes
router.get('/', (req, res) => {
    res.send('Hello World!');
});
router.post('/login', login);
router.post('/signup', signup);
module.exports = router;