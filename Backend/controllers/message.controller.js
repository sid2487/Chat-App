import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { to, text } = req.body; // to(jis user ke liye msg uski id) and msg content
        const sender = req.user._id;

        const receiver = await User.findById(to);
        const currentUser = await User.findById(sender);

        if(!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        // checks if receiver has blocked sender
        if (receiver.blockedUsers.includes(sender)) {
            return res.status(404).json({ message: "You are blocked by this user" });
        }

        // check if sender has blocked the receiver
        if(currentUser.blockedUsers.includes(to)){
            return res.status(400).json({ message: "You have blocked this user" });
        }

        const message = await Message.create({ sender, receiver: to, text });
        res.status(201).json(message);
    } catch (error) {
        console.error("Error in sending message", error);
        res.status(500).json({ message: "Failed to send message" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { to } = req.params; // receivers id
        const from = req.user._id; // senders id

        // This query fetches all messages: sent from "from" to "to" or from "to" to "from"
        // $or : It returns documents where at least one of the conditions is true.
        // use $or when you want to retrieve data that could match more than one scenario.
        const messages = await Message.find({
            $or: [
                { sender: from, receiver: to },
                { sender: to, receiver: from },
            ]
        }).sort({ createdAt: 1 }); // oldest first

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in loading messages", error);
        res.status(500).json({ message: "Failed to fetch messages" });
    }
}



