import express from "express";
import mongoose from "mongoose";
import "dotenv/config"
import userRoutes from './routes/user.js'
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser"
import config from './config/config.js'


const { MONGO_URI, PORT } = config;


mongoose.connect(MONGO_URI).then(() => {
    console.log("database connected successfully.")
}).catch(error => {
    console.log(error)
})

const app = express();

app.use(express.json())
app.use(cookieParser())


app.use("/api/user", userRoutes);
app.use('/api/auth', authRoutes)

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

