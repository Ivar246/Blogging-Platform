import User from "../models/User.js";
import * as argon from "argon2";
import config from "../config/config.js"
import { errorHandler } from "../utils/error.js";
import tokenUtil from "../utils/getToken.js";

const { AT_SECRET } = config;


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
            return next(errorHandler(400, "Password is Incorrect."));

        const payload = {
            id: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        }
        const { password: pass, ...rest } = user._doc;
        const atToken = tokenUtil.getAtToken(payload, AT_SECRET);

        console.log("atToken", atToken)

        return res.status(200).cookie('access_token', atToken, {
            httpOnly: true
        }).json(rest);

    } catch (error) {
        return next(error);
    }
}

export const google = async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;
    console.log(name, email, googlePhotoUrl)


    try {
        const user = await User.findOne({ email });
        if (user) {
            const { password, ...rest } = user._doc;
            const payload = {
                id: user.id,
                email: user.email,
                isAdmin: user.isAdmin
            }
            const token = tokenUtil.getAtToken(payload, AT_SECRET, { expiresIn: "120s" });

            return res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest);

        } else {
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: randomPassword,
                profilePicture: googlePhotoUrl

            });

            await newUser.save()


            const payload = {
                id: newUser._id,
                email: newUser.email,
                isAdmin: newUser.isAdmin
            }
            const token = tokenUtil.getAtToken(payload, AT_SECRET, { expiresIn: "120s" })
            const { password, ...rest } = newUser;
            return res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest);
        }

    } catch (error) {
        next(error)
    }
}