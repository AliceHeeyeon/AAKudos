import express from "express";
const router = express.Router();

import {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  editUser,
  login,
  changePassword,
  changePermissionOfUser,
} from "../controllers/userController.js";

//GET all users
router.get("/", getUsers);
//GET a single user
router.get("/:id", getUser);
//CREATE a user
router.post("/signup", createUser);
//Login
router.post("/login", login);
//DELETE a user
router.delete("/:Id/deleteuser", deleteUser);
//UPDATE user
router.patch("/:Id/edituser", editUser);
//UPDATE permission of user
router.patch("/:Id/changepermission", changePermissionOfUser);
//UPDATE user password
router.patch("/:Id/changepassword", changePassword);

export default router;
