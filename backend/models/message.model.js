import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    reciver :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    images: [{
        type: String,
    }]
}, { timestamps: true });  


const Message = mongoose.model("Message", messageSchema);
export default Message;