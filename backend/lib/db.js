import mongoose from "mongoose";

const conn = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected to db successfully")
    }
    catch (error) {
        console.log("error while connecting to db", error)
    }
}

export default conn;