// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
exports.register = async (req, resp) => {
    const { username, email, password } = req.body;
    const profilePic = req.file ? req.file.filename : null;

    try {

        if (!username || !email || !password || !profilePic) {
            return resp.status(400).send({ message: "Fields cannot be empty" });

        }

        let user = await User.findOne({ email });
        if (user) return resp.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser = new User({ username, email, password: hashedPassword, profilePic });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET,
           {expiresIn: process.env.JWT_EXPIRES_IN}
        );

        resp.status(201).json({ message: 'User registered successfully',token, user: newUser });
    } catch (err) {
        resp.status(500).json({ message: 'Error registering user', error: err.message });
    }
};


// Login

exports.login = async (req, resp) => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return resp.status(400).send({ message: "Fields cannot be empty" });
        }

        const user = await User.findOne({ email });
        if (!user) return resp.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return resp.status(401).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,
           {expiresIn :process.env.JWT_EXPIRES_IN}
        );

        resp.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        resp.status(500).json({ message: 'Error logging in', error: err.message });
    }
};

