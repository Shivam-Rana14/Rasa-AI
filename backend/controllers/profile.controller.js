// profile.controller.js
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "rasa_ai";

// Add analysis report for the authenticated user
exports.addAnalysisReport = async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const collection = client.db(DB_NAME).collection('users');
    const userEmail = req.user.email;
    const report = req.body.report; // Expecting report object in body
    if (!report) {
      client.close();
      return res.status(400).json({ message: 'No report provided' });
    }
    const result = await collection.updateOne(
      { email: userEmail },
      { $push: { analysisReports: report } }
    );
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
exports.getAnalysisReports = async (req, res) => {
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

// Delete an analysis report by ID from the user's reports array
exports.deleteAnalysisReport = async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const collection = client.db(DB_NAME).collection('users');
    const userEmail = req.user.email;
    const { reportId } = req.params;
    // Remove the report with the matching _id from the user's analysisReports array
    const result = await collection.updateOne(
      { email: userEmail },
      { $pull: { analysisReports: { _id: ObjectId(reportId) } } }
    );
    client.close();
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Report or user not found' });
    }
    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('[deleteAnalysisReport] Error:', err);
    res.status(500).json({ message: err.message });
  }
};
