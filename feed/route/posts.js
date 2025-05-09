const express = require('express');

const router = express.Router();

// Import controllers
const { createPost, getAllPosts, likePost, addComment, getPostComments, getUserPosts } = require('../controllers/posts');

// Routes
router.post('/create-post', createPost);
router.get('/get-all-posts', getAllPosts);
router.post('/like-post', likePost);
router.post('/add-comment', addComment);
router.get('/comments/:postId', getPostComments);
router.get('/user-posts/:userId', getUserPosts);

module.exports = router;
