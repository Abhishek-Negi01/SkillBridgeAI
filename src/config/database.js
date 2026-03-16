const mongoose = require("mongoose");
const { MONGO_URI } = require("../utils/dotenv.js");

async function connectToDB() {
  try {
    mongoose.connect(MONGO_URI);

    console.log("connected to database.");
  } catch (error) {
    console.log(error);
  }
}

module.exports = connectToDB;
