import mongoose from "mongoose";

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`[${new Date().toLocaleString()}] Connected to MongoDB`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

export default connectToDatabase;
