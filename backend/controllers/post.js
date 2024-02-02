import { errorHandler } from "../utils/error.js"
import Post from "../models/Post.js";

export const createPost = async (req, res, next) => {
    console.log()
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to create a post."));
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, "Please provide all the required fields."))
    }

    const slug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '-'); //replacing character which is not number or alphabet by -
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id
    })

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost)
    } catch (error) {
        next(error)
    }
}