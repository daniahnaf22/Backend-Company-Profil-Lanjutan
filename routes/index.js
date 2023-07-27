import express from "express";

import {
  getUsers,
  register,
  login,
  logout,
  deleteUser,
  updateUser,
} from "../controllers/UserController.js";

import {
  createBlog,
  deleteBlog,
  getAllBlog,
  getBlogById,
  updateBlog,
} from "../controllers/BlogController.js";

import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/ContactController.js";

import { refreshToken } from "../controllers/RefreshToken.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/users", getUsers);
router.get("/token", refreshToken);
router.post("/register", register);
router.post("/login", login);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.delete("/logout", logout);

router.get("/blog", getAllBlog);
router.get("/blog/:id", getBlogById);
router.post("/blog/", createBlog);
router.put("/blog/:id", updateBlog);
router.delete("/blog/:id", deleteBlog);

router.get("/contact", getAllContacts);
router.get("/contact/:id", getContactById);
router.post("/contact/", createContact);
router.put("/contact/:id", updateContact);
router.delete("/contact/:id", deleteContact);

export default router;
