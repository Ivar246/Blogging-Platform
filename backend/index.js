import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRoutes from './routes/user.js'
import authRoutes from "./routes/auth.js"
dotenv.config()

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("database connected successfully.")
}).catch(error => {
    console.log(error)
})

const app = express();

app.use(express.json())

const PORT = process.env.PORT


app.use("/api/user", userRoutes);

app.use('/api/auth', authRoutes)

app.listen(PORT, () => console.log(`server is running in the port ${PORT}`))

