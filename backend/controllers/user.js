import User from "../models/User.js";
import { errorHandler } from "../utils/error.js";
import * as argon from "argon2";

export const test = (req, res) => {
    res.json({ m: "hi k xa" })
}

export const updateUser = async (req, res, next) => {
    const userId = req.params.userId;
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "you are not allowed to update this user."))
    }


    if (req.body.password)
        if (req.body.password.length < 6)
            return next(errorHandler(400))


    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20)
            return next(errorHandler(400, "Username must be between 7 and 20 characters."))
        req.body.password = await argon.hash(req.body.password)
    }
    if (req.body.username.includes(" "))
        return next(errorHandler(400, "Username cannot contain spaces."));

    if (req.body.username !== req.body.username.toLowerCase())
        return next(errorHandler(400, "Username must be lowercase."));

    if (req.body.username.match(/^[a-zA-z0-9]+$/))
        return next(errorHandler(400, "Username only contain letters and numbers."))

    try {

        const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password
            }
        }, { new: true }); // new:true to get updated info

        const { password, ...rest } = updatedUser._doc;
        return res.status(200).json(rest)

    } catch (error) {
        next(error)
    }
}