import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(400).json({ message: " No token, auth denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        return res.status(401).json({ message: "TOken is invalid" });
    }
};

export default protect;