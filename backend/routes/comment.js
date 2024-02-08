import express from "express";
import { createComment } from "../controllers/Comment.js";
import { authenticate } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", authenticate, createComment);

export default router;