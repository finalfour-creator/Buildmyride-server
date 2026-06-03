import createError from "http-errors";
import Design from "../models/Design.js";

const VALID_FINISHES = ["glossy", "matte", "satin"];
const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

const validateState = (state) => {
  if (!state) throw createError(400, "Design state is required");
  if (!state.carId) throw createError(400, "state.carId is required");

  if (state.paint) {
    if (state.paint.color && !HEX_COLOR_REGEX.test(state.paint.color)) {
      throw createError(400, "Paint color must be a valid hex color (e.g. #ffffff)");
    }
    if (state.paint.finish && !VALID_FINISHES.includes(state.paint.finish)) {
      throw createError(400, `Paint finish must be one of: ${VALID_FINISHES.join(", ")}`);
    }
  }
};

export const createDesign = async (userId, { name, state }) => {
  validateState(state);
  return Design.create({ userId, name: name || "Untitled Design", state });
};

export const getUserDesigns = async (userId) => {
  return Design.find({ userId }).sort({ updatedAt: -1 });
};

export const getDesignById = async (id, userId) => {
  const design = await Design.findById(id);
  if (!design) throw createError(404, "Design not found");
  if (design.userId.toString() !== userId) throw createError(403, "Forbidden");
  return design;
};

export const updateDesign = async (id, userId, { state, name, thumbnail }) => {
  const design = await Design.findById(id);
  if (!design) throw createError(404, "Design not found");
  if (design.userId.toString() !== userId) throw createError(403, "Forbidden");

  if (state) validateState(state);

  return Design.findByIdAndUpdate(id, { state, name, thumbnail }, { new: true });
};
