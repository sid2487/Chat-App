import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/genrateToken.js";

export const register = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All fields are required " });

        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: "User already exist " });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        const token = generateToken(user._id);
        res.status(200).json({ user, token, message: "User registered successfully " });
    } catch (error) {
        console.error("Error in register", error);
        res.status(500).json({ message: "Error in register" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Inavalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id);
        res.status(200).json({ 
            success: true,
            token,
            user
        });
    } catch (error) {
        console.error("Error in login", error);
        res.status(500).json({ message: "Error in login" });
    }
};

// get all users except current user
export const getAllUsers = async(req, res) => {
    try {
        const currentUserId = req.user._id;
        
        const users = await User.find({ _id: { $ne: currentUserId }}).select("-password -blockedUsers -email");

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        res.status(500).json({ message: "Server error while fetching users" });
    }
}