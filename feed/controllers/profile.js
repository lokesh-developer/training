const User = require('../model/users');

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Here you would typically:
        // 1. Validate the id
        // 2. Find the user by id in your database
        // 3. Delete the user from your database
        // 4. Send success response
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'User deleted successfully',
            user: user
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const editUser = async (req, res) => {
    try {
        const { id, name } = req.body;

        // Here you would typically:
        // 1. Validate the id
        // 2. Find the user by id in your database
        // 3. Update the user in your database
        // 4. Send success response
        const user = await User.findByIdAndUpdate(id, { name }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'User updated successfully',
            user: user
        });
    } catch (error) {
        console.error('Edit user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { id, password } = req.body;

        // Here you would typically:
        // 1. Validate the id
        // 2. Find the user by id in your database
        // 3. Update the user in your database
        // 4. Send success response
        // use bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'User updated successfully',
            user: user
        });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({
            message: 'User found successfully',
            user: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    deleteUser,
    editUser,
    updatePassword,
    getUser
};