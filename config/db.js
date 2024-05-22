const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Database connection successful");
    console.log(
      "You are logged in database:",
      mongoose.connection.db.databaseName
    );
  } catch (e) {
    console.error("Database connection error:", e);
    process.exit(1);
  }
};

module.exports = dbConnect;
