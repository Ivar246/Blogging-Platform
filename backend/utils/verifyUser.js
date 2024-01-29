import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js"
import config from "../config/config.js";


export const authenticate = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return next(errorHandler(401, 'Unauthorized'));

    jwt.verify(token, config.AT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(401, "Unauthorized"));
        }
        req.user = user;
        return next();
    });
}