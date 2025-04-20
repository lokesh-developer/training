const User = require('../model/users');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Here you would typically:
        // 1. Validate the email and password
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 4. Send success response
        res.json({
            message: 'Login successful',
            user: user
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const signup = async (req, res) => {
    try {
        const {email, password, confirmPassword, name} = req.body;
        console.log(req.body);

        if (!email || !password || !confirmPassword || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        
        // Here you would typically:
        // 1. Validate the email and password
        // 2. Check if user exists in your database
        // 3. Hash the password
        // 4. Save the user in your database
        // 5. Send success response
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        
        res.json({
            message: 'User registered successfully',
            user: user
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    login: login,
    signup: signup
}