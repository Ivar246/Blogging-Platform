import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        requried: true,
    },
    userId: {
        type: String,
        requried: true
    },
    likes: {
        type: Array,
        default: [],
    },
    numberOfLikes: {
        type: Number,
        default: 0
    }
}, { timestamps: true });


const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;