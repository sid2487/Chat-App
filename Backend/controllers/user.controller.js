import {User} from "../models/user.model.js";


// Block User
export const blockUser = async (req, res) => {
    try {
        const currentUser = req.user;
        const targetUserId = req.params.id;

        const targetUser = await User.findById(targetUserId);
        if(!targetUser){
            return res.status(404).json({ message: "User not found" });
        }

        const isBlocked = currentUser.blockedUsers.includes(targetUserId);
        if(isBlocked){
            return res.status(404).json({ message: "User already blocked" });
        }

        currentUser.blockedUsers.push(targetUserId);
        await currentUser.save();
        res.status(200).json({ message: "User blocked" });
    } catch (error) {
        console.error("Error in blocking the user", error);
        res.status(500).json({ message: "Error in blocking the user" });
    }
};

// Unblock User
// req.user.blockedUsers : This is an array of user IDs that the logged-in user has blocked.
// .filter(...) : Go through every id in the blockedUsers array and check something.
// (id) => id.toString() !== req.params.id : Keep this id in the array if it is NOT equal to the user ID sent in the URL (req.params.id).
// (req.param.id ko chod ke baaki sb ko blocked user ke list me rhne do).

export const unblockUser = async (req, res) => {
    try {
        const currentUser = req.user;
        const targetUserId = req.params.id;

        const targetUser = await User.findById(targetUserId);
        if(!targetUser){
            return res.status(404).json({ message: "User not found" });
        }

        const isBlocked = currentUser.blockedUsers.includes(targetUserId);
        if(!isBlocked) {
            return res.status(404).json({ message: "User is not in your blocked list" });
        }

        currentUser.blockedUsers = currentUser.blockedUsers.filter((id) =>
            id.toString() !== targetUserId
        );

        await currentUser.save();
        res.status(201).json({ message: "User unblocked successfully" });
    } catch (error) {
        console.error("Error unblocking user: ", error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
