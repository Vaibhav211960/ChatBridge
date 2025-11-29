import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie-parser';
import { set } from 'mongoose';
import sendWelcomeEmail from '../emails/welcomeEmail.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    const { name, email, password } = req.body

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long." });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email already in use." })

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await new User({
            name,
            email,
            password: hash
        });
        await newUser.save()

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
        // const cookie = res.getHeader("Set-Cookie");
        // const cookie = req.cookies;
        // console.log(cookie);

        // await sendWelcomeEmail(newUser.email, newUser.name);
        
        res.status(201).json({ message: "User registered successfully.", cookie ,token, user: { id: newUser._id, name: newUser.name, email: newUser.email } }
        );
    }
    catch (err) {
        res.status(500).json({ message: "Server error.", error: err.message });
    }
}

export const logIn = async (req, res) => {
    const { email , password} = req.body

    try {
        
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }
        
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: "Invalid email or password."})
            const isMatch =  await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json({message: "Invalid email or password."})
            
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            )
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });
            console.log(user);
            res.status(200).json({ message: "Logged in successfully.", token, user: { id: user._id, name: user.name, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ message: "Server error.", error: err.message });
    }
};

export const logOut = async (req, res) => {
    await res.cookie("token", "")
    // await navigator("home")
    res.status(200).json({message: "Logged out successfully."})
}

export const updateProfilePic = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { profilePic } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }  
        
        const updateProfilePicRes = await cloudinary.uploader.upload(profilePic, {
            folder: 'profile_pics',
            width: 150,
            height: 150,
            crop: 'fill'
        });

        const updateUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: updateProfilePicRes.secure_url },
        )

        // user.profilePic = profilePicUrl;
        await updateUser.save();
        console.log(updateProfilePicRes.secure_url);
        console.log(profilePic);
        console.log(user);
        
        res.status(200).json({ message: "Profile picture updated successfully.", profilePic: user.profilePic });
    }
    catch (err) {
        res.status(500).json({ message: "Server error.", error: err.message });
    }
}