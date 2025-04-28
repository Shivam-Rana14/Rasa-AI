const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "rasa_ai";
const JWT_SECRET = process.env.JWT_SECRET;


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

  // Delete analysis report for the authenticated user by date
  const deleteAnalysisReport = async (req, res) => {
    let client;
    try {
      client = await MongoClient.connect(MONGODB_URI);
      const collection = client.db(DB_NAME).collection('users');
      const userEmail = req.user.email;
      const reportDate = req.params.date;
      if (!reportDate) {
        client.close();
        return res.status(400).json({ message: 'No report date provided' });
      }
      // Remove the report with the matching date
      const result = await collection.updateOne(
        { email: userEmail },
        { $pull: { analysisReports: { date: reportDate } } }
      );
      client.close();
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Report or user not found' });
      }
      res.status(200).json({ message: 'Analysis report deleted' });
    } catch (error) {
      console.error('[deleteAnalysisReport] Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = {
  authenticate,
  addAnalysisReport,
  getAnalysisReports,
  deleteAnalysisReport,
};