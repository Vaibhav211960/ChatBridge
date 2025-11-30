import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const sendMessage = async (req, res) => {
    const { content, images } = req.body;
    console.log(req.user);
    
    try {
        if (!content) {
            return res.status(400).json({ message: "Message content or images are required." });
        }
        const senderId = req.user.userId;
        const reciverId = req.params;
        console.log(senderId , reciverId);
        
        let imageUrl = [];

        if (images) {
            const updatedImageUrl = await cloudinary.uploader.upload(images);
            imageUrl.push(updatedImageUrl.secure_url);
        }

        const newMessage = new Message({
            sender: senderId,
            reciver: reciverId,
            content,
            images: imageUrl
        });

        await newMessage.save();
        res.status(201).json({ message: "Message sent successfully.", data: newMessage });

    } catch (err) {
        res.status(500).json({ message: "Server error.", error: err.message });
    }

}

export const getMessagesById = async (req, res) => {
    const { Id } = req.params;
    // const userId = req.user.userId;
    try {
        const messages = await Message.find()
    }
    catch (err) {
        res.status(500).json({ message: "Server error.", error: err.message });
    }
}

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({ users });
    }
    catch (err) {
        res.status(500).json({ message: "Server error.", error: err.message });
    }
}

export const getChatPartners = async (req, res) => {
    // const userId = req.user.userId;
    // try {
    //     const messages = await Message.find({
    //         // $or: [{ sender: userId }, { reciver: userId }]
    //     }).populate("sender reciver", "name email");
    //     const partnersMap = new Map();
    //     messages.forEach(msg => {
    //         const partner = msg.sender._id.toString() === userId ? msg.reciver : msg.sender;
    //         partnersMap.set(partner._id.toString(), partner);
    //     });
    //     const chatPartners = Array.from(partnersMap.values());
    //     res.status(200).json({ chatPartners });
    // }
    // catch (err) {
    //     res.status(500).json({ message: "Server error.", error: err.message });
    // }

}

// export { sendMessage, getMessagesById, getAllUser, getChatPartners };