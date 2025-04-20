const express = require('express');
const router = express.Router();

// Import controllers
const { updatePassword, editUser, deleteUser } = require('../controllers/profile');

// Routes
router.post('/update-password', updatePassword);
router.post('/edit-profile', editUser);
router.post('/delete-user', deleteUser);

module.exports = router;