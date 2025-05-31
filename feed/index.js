const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/database');

// Import routes
const userRoutes = require('./route/user');
const postRoutes = require('./route/posts');
const indexRoutes = require('./route/index');

// Use routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/', indexRoutes);

connectDB();
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
