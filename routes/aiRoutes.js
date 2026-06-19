import express from "express";
import * as aiController from "../controllers/aiController.js";

const router = express.Router();

router.post("/suggest", aiController.suggestDesign);

export default router;
