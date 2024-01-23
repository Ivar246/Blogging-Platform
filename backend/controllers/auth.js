import User from "../models/User.js";
import * as argon from "argon2";
import config from "../config/config.js"
import { errorHandler } from "../utils/error.js";
import tokenUtil from "../utils/getToken.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === "" || email === "" || password === "")
        return next(errorHandler(400, "All fields are required"))

    const hash = await argon.hash(password)
    const newUser = new User({
        username,
        email,
        password: hash,
    });

    try {
        await newUser.save()
        return res.json({ message: "Signup successfull" });
    } catch (error) {
        return next(error);
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
        next(errorHandler(400, "All fields are Required"))
    }

    try {
        const user = await User.findOne({ email });

        if (!user)
            return next(errorHandler(404, "User not found."));

        const isMatch = await argon.verify(user.password, password);

        if (!isMatch)
            return next(errorHandler(400, "Password is Incorrect"));

        const payload = {
            id: user._id,
            email: user.email
        }
        const { password: pass, ...rest } = user._doc;
        const atToken = tokenUtil.getAtToken(payload, config.AT_SECRET);

        return res.status(200).cookie('access_token', atToken, {
            httpOnly: true
        }).json(rest);

    } catch (error) {
        return next(error);
    }
}