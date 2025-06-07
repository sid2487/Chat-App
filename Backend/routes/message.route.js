import express, { Router } from "express";
import protect from "../middleware/protect.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", protect, sendMessage );
router.get("/:to", protect, getMessages);


export default router;