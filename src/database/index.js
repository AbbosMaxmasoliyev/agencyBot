const mongoose = require("mongoose");
const config = require("../utils/config");
const logger = require("../../utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("Mongo connected");
  } catch (error) {
    logger.info(error);
    process.exit();
  }
};
// connectDB();

const db = {
  User: require("../../models/user"),
};

module.exports = db;
