import express from 'express';
import { createPost } from '../controllers/post.js';
import { authenticate } from '../utils/verifyUser.js'


const router = express.Router()

router.post('/create', authenticate, createPost)

export default router;