import express from "express";
import mongoose from "mongoose";
import "dotenv/config"
import userRoutes from './routes/user.js'
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/post.js"
import cookieParser from "cookie-parser"
import config from './config/config.js'
import morgan from "morgan";

const { MONGO_URI, PORT } = config;


mongoose.connect(MONGO_URI).then(() => {
    console.log("database connected successfully.")
}).catch(error => {
    console.log(error)
})

const app = express();

app.use(cookieParser())
app.use(express.json())


app.use(morgan("dev"))

app.use("/api/user", userRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/post", postRoutes)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.listen(PORT, () => console.log(`server is running in the port ${PORT}`))

