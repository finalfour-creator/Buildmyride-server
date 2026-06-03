import createError from "http-errors";
import mongoose from "mongoose";
import Part from "../models/Part.js";
import CarModel from "../models/CarModels.js";

const VALID_CATEGORIES = ["Hood", "Spoilers", "Wheels", "Bumper", "Door", "Lights", "Name_Plates", "Trunk"];

export const getParts = async ({ carId, category } = {}) => {
  if (category && !VALID_CATEGORIES.includes(category)) {
    throw createError(400, `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }

  if (carId && !mongoose.Types.ObjectId.isValid(carId)) {
    throw createError(400, "Invalid car ID format");
  }

  const query = {};
  if (carId) query.compatibleCars = carId;
  if (category) query.category = category;

  return Part.find(query);
};

export const getPartById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, "Invalid part ID format");
  }
  const part = await Part.findById(id);
  if (!part) throw createError(404, "Part not found");
  return part;
};

export const createPart = async ({ name, category, modelUrl, thumbnail, compatibleCars, price }) => {
  if (!name || !name.trim()) throw createError(400, "Part name is required");
  if (!category) throw createError(400, "Category is required");
  if (!VALID_CATEGORIES.includes(category)) {
    throw createError(400, `Invalid category. Must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }
  if (!modelUrl || !modelUrl.trim()) throw createError(400, "Model URL is required");
  if (price !== undefined && (typeof price !== "number" || price < 0)) {
    throw createError(400, "Price must be a non-negative number");
  }

  if (compatibleCars && compatibleCars.length > 0) {
    const invalidIds = compatibleCars.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) throw createError(400, "One or more car IDs are invalid");

    const found = await CarModel.find({ _id: { $in: compatibleCars } }).select("_id");
    if (found.length !== compatibleCars.length) {
      throw createError(404, "One or more compatible cars do not exist");
    }
  }

  return Part.create({ name: name.trim(), category, modelUrl: modelUrl.trim(), thumbnail, compatibleCars, price });
};
