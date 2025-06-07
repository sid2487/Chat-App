import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    isOnline: {
        type: Boolean,
        default: false,
    },
    blockedUsers: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
}, {timestamps: true });

export const User = mongoose.model("User", userSchema);
// export default mongoose.model("User", userSchema);