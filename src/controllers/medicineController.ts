import { Response } from "express";
import { and, eq} from "drizzle-orm";
import { db } from "../db/connection";
import { medicines } from "../db/schemas/medicineSchema";
import { AuthRequest } from "../middleware/authenticate";

export const createMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const [medicine] = await db
      .insert(medicines)
      .values({
        ...req.body,
        user_id: req.user!.id,
      })
      .returning();

    return res.status(201).json(medicine);
  } catch (error) {
    console.error("CREATE MEDICINE ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getMedicines = async (req: AuthRequest, res: Response) => {
  try {
    const userMedicines = await db
      .select()
      .from(medicines)
      .where(eq(medicines.user_id, req.user!.id));

    return res.status(200).json(userMedicines);
  } catch (error) {
    console.error("GET MEDICINES ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const [medicine] = await db
      .update(medicines)
      .set(req.body)
      .where(
        and(
          eq(medicines.id, id),
          eq(medicines.user_id, req.user!.id)
        )
      )
      .returning();

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    return res.status(200).json(medicine);
  } catch (error) {
    console.error("UPDATE MEDICINE ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMedicine = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const [medicine] = await db
      .delete(medicines)
      .where(
        and(
          eq(medicines.id, id),
          eq(medicines.user_id, req.user!.id)
        )
      )
      .returning();

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    return res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    console.error("DELETE MEDICINE ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};