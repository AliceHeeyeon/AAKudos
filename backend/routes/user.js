import express from 'express';
const router = express.Router();

import {
    getUsers,
    getUser,
    signup,
    login
} from "../controllers/userController.js"

//GET all users
router.get("/", getUsers)
//GET a single user
router.get("/:id", getUser)
//Signup
router.post("/signup", signup)
//Login
router.post("/login", login);

export default router;