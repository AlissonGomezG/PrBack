import { Response, Request } from "express";
import { db } from "../db/connection";
import { userProfiles } from "../db/schemas/userSchema";
import { AuthRequest } from "../middleware/authenticate";
import { eq } from "drizzle-orm";

export const createProfile = async (
    req: AuthRequest,
    res: Response
) => {
    try {

        const [profile] = await db
            .insert(userProfiles)
            .values({
                ...req.body,
                user_id: req.user!.id,
            })
            .returning();

        return res.status(201).json(profile);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


export const getProfile = async (
    req: AuthRequest,
    res: Response
) => {
    try {

        const [profile] = await db
            .select()
            .from(userProfiles)
            .where(
                eq(
                    userProfiles.user_id,
                    req.user!.id
                )
            );

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        return res.status(200).json(profile);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        if (!id) {
            return res.status(400).json({ message: "Invalid id" });
        }

        const { name,  identification_number,age, height, weight, blood_type, gender  } = req.body;

        const [profile] = await db
            .update(userProfiles)
            .set({
                name,
                identification_number,
                age,
                height,
                weight,
                blood_type,
                gender
            })
            .where(eq(userProfiles.id, id))
            .returning();

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        return res.status(200).json(profile);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const updateEmergencyContact = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const emergency_contact = req.body.emergency_contact;
    const emergency_person = req.body.emergency_person;
    const relationship = req.body.relationship;

    const updateData: any = {};

    if (emergency_contact) updateData.emergency_contact = emergency_contact;
    if (emergency_person) updateData.emergency_person = emergency_person;
    if (relationship) updateData.relationship = relationship;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No valid fields to update",
      });
    }

    const [profile] = await db
      .update(userProfiles)
      .set(updateData)
      .where(eq(userProfiles.id, id))
      .returning();

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    return res.status(200).json(profile);

  } catch (error) {
    console.error("EMERGENCY UPDATE ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};