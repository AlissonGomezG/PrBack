import { Router } from "express";
//import controller
import { register, login } from "../controllers/authController";
//import validation middleware
import { validateBody } from "../middleware/validations";
//import schema
import { insertUserSchema, loginUserSchema } from "../db/schemas/userSchema";

const router = Router();

router.post("/login",validateBody(loginUserSchema), login);

router.post("/register", validateBody(insertUserSchema), register);

export default router;