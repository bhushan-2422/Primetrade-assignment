import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/signUp").post(registerUser)
router.route("/login").post(loginUser)

router.route("/getCurrentUser").post(verifyJWT, getCurrentUser)
router.route('/logout').post(verifyJWT, logoutUser)
router.route("/createNote").post(verifyJWT)
router.route("/deleteNote").post(verifyJWT)
router.route("/getAllNotes").post(verifyJWT)
router.route("/markAsComplete").post(verifyJWT)

export default router