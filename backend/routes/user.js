import express from 'express';
const router = express.Router();

import {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    editUser,
    login,
    changePassword
} from "../controllers/userController.js"

//GET all users
router.get("/", getUsers)
//GET a single user
router.get("/:id", getUser)
//CREATE a user
router.post("/createuser", createUser)
//Login
router.post("/login", login);
//DELETE a user
router.delete("/:Id/deleteuser", deleteUser)
//UPDATE user
router.patch("/:Id/edituser", editUser)
//UPDATE user password
router.patch("/:Id/changepassword", changePassword)

export default router;