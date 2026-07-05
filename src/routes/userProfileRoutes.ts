import { Router } from "express";
import { createProfile, getProfile, updateEmergencyContact, updateProfile } from "../controllers/userProfileController";
import { authenticate } from "../middleware/authenticate";
import { validateBody } from "../middleware/validations";
import { insertUserProfileSchema, updateUserProfileSchema } from "../db/schemas/userSchema";

const router = Router();

router.get("/", authenticate, getProfile);

router.post("/", authenticate, validateBody(insertUserProfileSchema),createProfile);

router.patch("/:id", validateBody(updateUserProfileSchema),updateProfile);

router.patch("/:id/emergency-contact", updateEmergencyContact);


export default router;