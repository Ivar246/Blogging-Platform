import User from "../models/User.js";
import * as argon from "argon2"

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === "" || email === "" || password === "")
        return res.status(400).json({ message: "All Fields are required" })

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
        res.status(500).json({ message: error.message })
    }
}