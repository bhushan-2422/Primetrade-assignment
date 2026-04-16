import { Router } from "express";
import { completionToggle, createTask, deleteTask, getAllTask, getCurrentUser, loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/signUp").post(registerUser)
router.route("/login").post(loginUser)
router.route("/getCurrentUser").post(verifyJWT, getCurrentUser)
router.route('/logout').post(verifyJWT, logoutUser)

router.route("/createTask").post(verifyJWT, createTask)
router.route("/deleteTask").post(verifyJWT, deleteTask)
router.route("/getAllTask").post(verifyJWT, getAllTask)
router.route("/markAsComplete").post(verifyJWT, completionToggle)

export default router