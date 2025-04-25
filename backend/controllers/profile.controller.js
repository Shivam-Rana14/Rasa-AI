const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || "rasa_ai";

// Get profile and reports for a user
const getProfile = async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const profileCollection = client.db(DB_NAME).collection("profile");
    const userId = req.params.userId;
    const profile = await profileCollection.findOne({ userId: new ObjectId(userId) });
    client.close();
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Create or update profile (add analysis report)
const addAnalysisReport = async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const profileCollection = client.db(DB_NAME).collection("profile");
    const userId = req.params.userId;
    const { report } = req.body;
    let profile = await profileCollection.findOne({ userId: new ObjectId(userId) });
    if (!profile) {
      // Create new profile
      profile = {
        userId: new ObjectId(userId),
        reports: [report],
      };
      await profileCollection.insertOne(profile);
    } else {
      // Update existing profile
      await profileCollection.updateOne(
        { userId: new ObjectId(userId) },
        { $push: { reports: report } }
      );
    }
    client.close();
    res.json({ message: "Report added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update user profile details (username, email, password)
const updateProfile = async (req, res) => {
  let client;
  try {
    client = await MongoClient.connect(MONGODB_URI);
    const usersCollection = client.db(DB_NAME).collection("users");
    const userId = req.params.userId;
    const { name, email, password } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      const bcrypt = require("bcrypt");
      updateData.password = await bcrypt.hash(password, 10);
    }
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );
    client.close();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getProfile,
  addAnalysisReport,
  updateProfile,
};
