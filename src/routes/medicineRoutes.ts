import { Router } from "express";
import {createMedicine, getMedicines, updateMedicine, deleteMedicine} from "../controllers/medicineController";
import { authenticate } from "../middleware/authenticate";
import { validateBody } from "../middleware/validations";
import { insertMedicineSchema, updateMedicineSchema } from "../db/schemas/medicineSchema";

const router = Router();

router.get("/", authenticate, getMedicines);

router.post("/",authenticate,validateBody(insertMedicineSchema),createMedicine);

router.put("/:id", authenticate, validateBody(updateMedicineSchema.partial()), updateMedicine);

router.delete("/:id", authenticate, deleteMedicine);
    
export default router;