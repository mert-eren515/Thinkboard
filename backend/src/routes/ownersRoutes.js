import express from "express";
import { createOwner } from "../controllers/ownersController.js";

const router = express.Router();

router.post("/", createOwner);

export default router;
