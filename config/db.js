import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB connection SUCCESS");
    } catch (error) {
        console.log(error)
        console.error("MongoDB connection FAILED.");
        process.exit(1);
    }
}

export default connectDB;