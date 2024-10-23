import express from "express";
const router = express.Router();
import protectRoute from "../middleware/protectRoute.js";
import { getUsers } from "../contollers/userController.js";

router.get('/', protectRoute, getUsers)

export default router