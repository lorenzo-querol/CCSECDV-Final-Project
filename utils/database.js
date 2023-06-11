import mongoose from "mongoose";

const MONGODB_URI =
    "mongodb+srv://realmsoflorenzo:pFO2wFVjrNF72MM4@cluster0.seb92k2.mongodb.net/secure-web";

async function connectToDatabase() {
    try {
        await mongoose.connect(MONGODB_URI, {
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
