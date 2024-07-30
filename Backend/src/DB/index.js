import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstances = await mongoose.connect(`${process.env.MONGODB_URI}/ERP-software`);
        console.log(`MongoDB Connected!! DB Host : ${connectionInstances.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error : ", error);
        process.exit(1);
    }
}

export {connectDB};