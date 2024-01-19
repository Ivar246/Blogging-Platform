import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("database connected successfully.")
}).catch(error => {
    console.log(error)
})

const app = express();

const PORT = process.env.PORT


app.listen(PORT, () => console.log(`server is running in the port ${PORT}`))

