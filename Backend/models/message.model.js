import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// export default mongoose.model("Message", messageSchema);
export const Message = mongoose.model("Message", messageSchema);