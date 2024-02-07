import express from "express";
import { test, updateUser, deleteUser, signout, getUsers } from "../controllers/user.js"
import { authenticate } from "../utils/verifyUser.js";
const router = express.Router()

router.get("/test", test);
router.put("/update/:userId", authenticate, updateUser);
router.delete("/delete/:userId", authenticate, deleteUser);
router.post("/signout", signout)
router.get("/getUsers", authenticate, getUsers)

export default router