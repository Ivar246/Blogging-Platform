import express from 'express';
import { createPost, getPosts, deletePost, updatePost } from '../controllers/post.js';
import { authenticate } from '../utils/verifyUser.js'


const router = express.Router()

router.post('/create', authenticate, createPost);
router.get("/getPosts", getPosts);
router.delete("/deletePost/:postId/:userId", authenticate, deletePost);
router.put('/updatePost/:postId/:userId', authenticate, updatePost);

export default router;