import express from "express";
import { test, updateUser } from "../controllers/user.js"
import { authenticate } from "../utils/verifyUser.js";
const router = express.Router()

router.get("/test", test);
router.put("/update/:userId", authenticate, updateUser)

export default router