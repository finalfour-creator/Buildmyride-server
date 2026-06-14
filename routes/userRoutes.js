import express from "express";
import * as userController from "../controllers/userController.js";
import { isAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", userController.createUser);
router.get("/", isAuth, userController.getUsers);

router.put("/update-name", isAuth, userController.updateName);
router.put("/update-email", isAuth, userController.updateEmail);
router.put("/update-password", isAuth, userController.updatePassword);

router.put("/:id", isAuth, userController.updateUser);
router.delete("/:id", isAuth, userController.deleteUser);

export default router;
