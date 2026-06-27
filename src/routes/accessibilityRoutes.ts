import { Router } from "express";
import { getAccessibilitySettings, updateAccessibilitySettings } from "../controllers/accessibilityController";
import { authenticate } from "../middleware/authenticate";
import { validateBody } from "../middleware/validations";
import { updateAccessibilitySchema } from "../db/schemas/accessibilitySchema";

const router = Router();

router.get("/", authenticate, getAccessibilitySettings);

router.put("/", authenticate, validateBody(updateAccessibilitySchema), updateAccessibilitySettings);

export default router;
