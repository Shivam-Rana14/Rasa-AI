const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Use environment variables and ensure they're loaded
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'rasa_ai';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const signup = async (req, res) => {
    let client;
    try {
        // Connect to MongoDB
        client = await MongoClient.connect(MONGODB_URI);
        const collection = client.db(DB_NAME).collection('users');
        
        // Check if user already exists
        const existingUser = await collection.findOne({ email: req.body.email });
        if (existingUser) {
            client.close();
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        // Create new user
        const newUser = {
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
            createdAt: new Date()
        };

        await collection.insertOne(newUser);
        client.close();
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const signin = async (req, res) => {
    let client;
    try {
        client = await MongoClient.connect(MONGODB_URI);
        const collection = client.db(DB_NAME).collection('users');
        
        // Find user
        const user = await collection.findOne({ email: req.body.email });
        if (!user) {
            client.close();
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {
            client.close();
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        client.close();
        res.status(200).json({
            token,
            user: {
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    signup,
    signin
};
