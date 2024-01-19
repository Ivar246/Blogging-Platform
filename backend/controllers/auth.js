import User from "../models/User.js";
import * as argon from "argon2"
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === "" || email === "" || password === "")
        return next(errorHandler(400, "All fields are required"))

    const hash = argon.hash(password)
    const newUser = new User({
        username,
        email,
        password: hash
    })
    try {
        await newUser.save()
        return res.json({ message: "Signup successfull" });
    } catch (error) {
        return next(error)
    }
}