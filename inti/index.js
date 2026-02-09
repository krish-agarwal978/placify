const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URI;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
   initData.data=initData.data.map((obj) => (
    {
      ...obj,
      owner: "6979a77648d8e64365b5be60" // Assigning a default owner to each listing
    }
  ));
   
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();