// config/db.js
// This file is responsible for ONE thing only: connecting to MongoDB using Mongoose.

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise, so we await it.
    // MONGO_URI comes from our .env file (see config/db.js usage in server.js)
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // If we can't connect to the database, there is no point running the server.
    process.exit(1);
  }
};

module.exports = connectDB;
