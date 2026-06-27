import { Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/connection";
import { accessibilitySettings } from "../db/schemas/accessibilitySchema";
import { AuthRequest } from "../middleware/authenticate";

export const getAccessibilitySettings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const [settings] = await db
      .select()
      .from(accessibilitySettings)
      .where(eq(accessibilitySettings.user_id, req.user!.id));

    if (!settings) {
      // Si no existen configuraciones, crear las por defecto
      const [newSettings] = await db
        .insert(accessibilitySettings)
        .values({
          user_id: req.user!.id,
          fontSize: 100,
          fontWeight: false,
          letterSpacing: false,
          textToSpeech: false,
        })
        .returning();

      return res.status(200).json(newSettings);
    }

    return res.status(200).json(settings);
  } catch (error) {
    console.error("GET ACCESSIBILITY SETTINGS ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateAccessibilitySettings = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { fontSize, fontWeight, letterSpacing, textToSpeech } = req.body;

    // Primero, verificar si existen configuraciones para el usuario
    const [existingSettings] = await db
      .select()
      .from(accessibilitySettings)
      .where(eq(accessibilitySettings.user_id, req.user!.id));

    let result;

    if (!existingSettings) {
      // Crear nuevas configuraciones
      [result] = await db
        .insert(accessibilitySettings)
        .values({
          user_id: req.user!.id,
          fontSize,
          fontWeight,
          letterSpacing,
          textToSpeech,
        })
        .returning();
    } else {
      // Actualizar configuraciones existentes
      [result] = await db
        .update(accessibilitySettings)
        .set({
          fontSize,
          fontWeight,
          letterSpacing,
          textToSpeech,
        })
        .where(eq(accessibilitySettings.user_id, req.user!.id))
        .returning();
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("UPDATE ACCESSIBILITY SETTINGS ERROR:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
