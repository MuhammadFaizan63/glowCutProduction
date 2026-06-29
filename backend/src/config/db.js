import mongoose from "mongoose";
import config from "./config.js";

async function connectDb() {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

export default connectDb;