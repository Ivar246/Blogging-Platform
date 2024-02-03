import express from 'express';
import { createPost, getPosts } from '../controllers/post.js';
import { authenticate } from '../utils/verifyUser.js'


const router = express.Router()

router.post('/create', authenticate, createPost);
router.get("/getPosts", getPosts);

export default router;