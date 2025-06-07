import express from "express";
import protect from "../middleware/protect.js";
import { blockUser, unblockUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/block/:id", protect, blockUser );
router.post("/unblock/:id", protect, unblockUser);

export default router;