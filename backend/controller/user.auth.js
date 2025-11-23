import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import cookie from 'cookie-parser';
import { set } from 'mongoose';

const signup = async (req, res) => {
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
        const cookie = req.cookies;
        console.log(cookie);
        
        res.status(201).json({ message: "User registered successfully.", cookie ,token, user: { id: newUser._id, name: newUser.name, email: newUser.email } }
        );
    }
    catch (err) {
        res.status(500).json({ message: "Server error.", error: err.message });
    }
}

export default signup;