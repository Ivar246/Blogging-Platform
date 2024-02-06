import express from 'express';
import { createPost, getPosts, deletePost } from '../controllers/post.js';
import { authenticate } from '../utils/verifyUser.js'


const router = express.Router()

router.post('/create', authenticate, createPost);
router.get("/getPosts", getPosts);
router.delete("/deletePost/:postId/:userId", authenticate, deletePost)

export default router;