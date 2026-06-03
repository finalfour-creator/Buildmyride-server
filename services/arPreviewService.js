import createError from "http-errors";
import ArPreview from "../models/ArPreview.js";

const VALID_FINISHES = ["glossy", "matte", "satin"];
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

const validatePaint = (paint) => {
  if (!paint) return;
  if (paint.color && !HEX_COLOR_REGEX.test(paint.color)) {
    throw createError(400, "Paint color must be a valid hex color (e.g. #ffffff)");
  }
  if (paint.finish && !VALID_FINISHES.includes(paint.finish)) {
    throw createError(400, `Paint finish must be one of: ${VALID_FINISHES.join(", ")}`);
  }
};

export const createArPreview = async (userId, { name, thumbnail, state }) => {
  if (state?.paint) validatePaint(state.paint);

  return ArPreview.create({
    userId,
    name: name || "AR Preview",
    thumbnail: thumbnail || "",
    state: state || {},
  });
};

export const getUserArPreviews = async (userId) => {
  return ArPreview.find({ userId }).sort({ updatedAt: -1 });
};

export const getArPreviewById = async (id, userId) => {
  const doc = await ArPreview.findById(id);
  if (!doc) throw createError(404, "AR preview not found");
  if (doc.userId.toString() !== userId) throw createError(403, "Forbidden");
  return doc;
};

export const updateArPreview = async (id, userId, { name, thumbnail, state }) => {
  const doc = await ArPreview.findById(id);
  if (!doc) throw createError(404, "AR preview not found");
  if (doc.userId.toString() !== userId) throw createError(403, "Forbidden");

  if (state?.paint) validatePaint(state.paint);

  const fields = {};
  if (name != null) fields.name = name;
  if (thumbnail != null) fields.thumbnail = thumbnail;
  if (state != null) fields.state = state;

  return ArPreview.findByIdAndUpdate(id, fields, { new: true });
};

export const deleteArPreview = async (id, userId) => {
  const doc = await ArPreview.findById(id);
  if (!doc) throw createError(404, "AR preview not found");
  if (doc.userId.toString() !== userId) throw createError(403, "Forbidden");
  await ArPreview.findByIdAndDelete(id);
};
