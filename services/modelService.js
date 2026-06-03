import createError from "http-errors";
import mongoose from "mongoose";
import CarModel from "../models/CarModels.js";

export const getModels = async () => CarModel.find();

export const getModelById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError(400, "Invalid model ID format");
  }
  const model = await CarModel.findById(id);
  if (!model) throw createError(404, "Car model not found");
  return model;
};

export const createModel = async ({ name, brand, chassisUrl, modelUrl }) => {
  if (!name || !name.trim()) throw createError(400, "Model name is required");
  if (!brand || !brand.trim()) throw createError(400, "Brand is required");
  if (!chassisUrl || !chassisUrl.trim()) throw createError(400, "Chassis URL is required");

  const existing = await CarModel.findOne({ name: name.trim(), brand: brand.trim() });
  if (existing) {
    throw createError(409, `Car model "${name.trim()}" by "${brand.trim()}" already exists`);
  }

  return CarModel.create({ name: name.trim(), brand: brand.trim(), chassisUrl: chassisUrl.trim(), modelUrl });
};
