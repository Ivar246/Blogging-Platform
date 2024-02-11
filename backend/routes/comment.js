import express from "express";
import { createComment, getPostComments, likeComment, editComment } from "../controllers/Comment.js";
import { authenticate } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", authenticate, createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId", authenticate, likeComment);
router.put("/editComment/:commentId", authenticate, editComment);


export default router;