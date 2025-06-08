import express from "express";
import { getAllUsers, login, register } from "../controllers/auth.controller.js";
import protect from "../middleware/protect.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", protect, getAllUsers);


export default router;