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
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal server error' });
        
    }
};

module.exports = {
    createPost
};