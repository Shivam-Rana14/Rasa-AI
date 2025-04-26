const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "rasa_ai";
const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
  let client;
  try {
    // Connect to MongoDB
    client = await MongoClient.connect(MONGODB_URI);
    const collection = client.db(DB_NAME).collection("users");

    // Check if user already exists
    const existingUser = await collection.findOne({ email: req.body.email });
    if (existingUser) {
      client.close();
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create new user
    const newUser = {
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
      createdAt: new Date(),
      analysisReports: [], // Initialize analysisReports array
    };

    await collection.insertOne(newUser);
    client.close();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signin = async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const collection = client.db(DB_NAME).collection("users");

    // Find user
    const user = await collection.findOne({ email: req.body.email });
    if (!user) {
      client.close();
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      client.close();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    client.close();
    res.status(200).json({
      token,
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to verify JWT and extract user email
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Add analysis report for the authenticated user
const addAnalysisReport = async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const collection = client.db(DB_NAME).collection('users');
    const userEmail = req.user.email;
    const report = req.body.report; // Expecting report object in body
    console.log('[addAnalysisReport] userEmail:', userEmail, 'report:', report);
    if (!report) {
      client.close();
      return res.status(400).json({ message: 'No report provided' });
    }
    const result = await collection.updateOne(
      { email: userEmail },
      { $push: { analysisReports: report } }
    );
    console.log('[addAnalysisReport] MongoDB update result:', result);
    client.close();
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Analysis report added' });
  } catch (error) {
    console.error('[addAnalysisReport] Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all analysis reports for the authenticated user
const getAnalysisReports = async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const collection = client.db(DB_NAME).collection('users');
    const userEmail = req.user.email;
    const user = await collection.findOne({ email: userEmail });
    client.close();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ analysisReports: user.analysisReports || [] });
  } catch (error) {
    console.error('Get analysis reports error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete analysis report for the authenticated user
const deleteAnalysisReport = async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const collection = client.db(DB_NAME).collection('users');
    const userEmail = req.user.email;
    const reportId = req.params.id;

    if (!reportId) {
      client.close();
      return res.status(400).json({ message: 'No report ID provided' });
    }

    // Remove the report by _id or date (support both for compatibility)
    const result = await collection.updateOne(
      { email: userEmail },
      { $pull: {
          analysisReports: {
            $or: [
              { _id: reportId },
              { date: reportId }
            ]
          }
        }
      }
    );
    client.close();
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Report not found or already deleted' });
    }
    res.status(200).json({ message: 'Analysis report deleted' });
  } catch (error) {
    console.error('[deleteAnalysisReport] Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  signup,
  signin,
  authenticate, // Export middleware
  addAnalysisReport,
  getAnalysisReports,
  deleteAnalysisReport,
};
