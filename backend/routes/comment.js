import express from "express";
import { createComment, getPostComments, likeComment, editComment, deleteComment } from "../controllers/Comment.js";
import { authenticate } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", authenticate, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", authenticate, likeComment);
router.put("/editComment/:commentId", authenticate, editComment);
router.delete("/deleteComment/:commentId/:userId", authenticate, deleteComment);

export default router;