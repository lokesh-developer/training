const Post = require('../model/posts');

const createPost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const post = new Post({
            title,
            description
        });
        await post.save();
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createPost
};