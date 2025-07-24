const mongoose = require("mongoose");
require("dotenv").config;
const MONGODB_URL = process.env.MONGO_URL;

async function mongoConnect() {
  await mongoose
    .connect(MONGODB_URL)
    .then(() => {
      console.log("mongoDB is connected");
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = mongoConnect;
