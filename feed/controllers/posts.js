const Post = require('../model/posts');

const createPost = async (req, res) => {
    try {
        const { userId, description } = req.body;
        console.log(userId, description);
        const post = new Post({
            userId,
            description
        });
        await post.save();
        res.status(201).json({ message: 'Post created successfully', post });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
        
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Get all posts, newest first
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const likePost = async (req, res) => {
    try {
        const { postId, userId } = req.body;
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        const isLiked = post.likes.includes(userId);
        
        // Toggle like status
        if (isLiked) {
            // Unlike - remove user from likes array
            post.likes = post.likes.filter(id => id !== userId);
        } else {
            // Like - add user to likes array
            post.likes.push(userId);
        }
        
        await post.save();
        
        res.status(200).json({ 
            message: isLiked ? 'Post unliked' : 'Post liked', 
            isLiked: !isLiked,
            likeCount: post.likes.length,
            post
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const addComment = async (req, res) => {
    try {
        const { postId, userId, text } = req.body;
        
        if (!text.trim()) {
            return res.status(400).json({ error: 'Comment text is required' });
        }
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        const newComment = {
            userId,
            text,
            createdAt: new Date()
        };
        
        post.comments.push(newComment);
        post.updatedAt = new Date();
        
        await post.save();
        
        res.status(201).json({ 
            message: 'Comment added successfully', 
            comment: newComment,
            commentCount: post.comments.length,
            post
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        
        res.status(200).json(post.comments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const posts = await Post.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createPost,
    getAllPosts,
    likePost,
    addComment,
    getPostComments,
    getUserPosts
};