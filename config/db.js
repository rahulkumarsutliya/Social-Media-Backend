const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongodb connected");
    } catch (err) {
        console.log("Mongodb connection failed:", err.message);
        process.exit(1);
    }
};

module.exports = connectDb;