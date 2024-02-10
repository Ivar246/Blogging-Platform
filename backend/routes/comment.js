import express from "express";
import { createComment, getPostComments, likeComment } from "../controllers/Comment.js";
import { authenticate } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", authenticate, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commendId", authenticate, likeComment);

export default router;