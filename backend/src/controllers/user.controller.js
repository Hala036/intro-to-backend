import { User } from '../models/user.model.js';

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // basic validation
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // check for existing user
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // create new user
        const user = await User.create({
            username: username.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            password: password,
            loggedIn: false
        })

        res.status(201).json({ message: 'User registered successfully', user: { id: user._id, username: user.username, email: user.email } });
        
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        // check if the user already exists
        const { email, password } = req.body;

        const user = await User.findOne({ 
            email: email.toLowerCase().trim() 
        });

        if (!user) {
            return res.status(400).json({ 
                message: 'User not found' 
            });
        }

        // validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }

        res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
        
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error', error: error.message
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ 
            email: email.toLowerCase().trim() 
        });

        if(!user) {
            return res.status(400).json({ 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            message: 'Logout successful!'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error', error: error.message
        })
    }
}
export { registerUser, loginUser, logoutUser };