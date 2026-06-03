import * as modelService from "../services/modelService.js";

export const getModels = async (req, res) => {
  const models = await modelService.getModels();
  res.status(200).json(models);
};

export const getModelById = async (req, res) => {
  const model = await modelService.getModelById(req.params.id);
  res.status(200).json(model);
};

export const createModel = async (req, res) => {
  const model = await modelService.createModel(req.body);
  res.status(201).json(model);
};
