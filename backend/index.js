require('dotenv').config();
const express = require('express');
const authRouter = require('./routes/auth.routes');
const profileRouter = require("./routes/profile.route")
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
// CORS setup
const allowedOrigins = [
  'http://localhost:5173', 

  'https://rasa-ai.vercel.app'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // if you use cookies/auth
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use("/api/profile",profileRouter)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('MongoDB Connection String:', process.env.MONGODB_URI);
});
