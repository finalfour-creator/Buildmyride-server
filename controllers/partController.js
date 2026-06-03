import * as partService from "../services/partService.js";

export const getParts = async (req, res) => {
  const parts = await partService.getParts(req.query);
  res.status(200).json(parts);
};

export const getPartById = async (req, res) => {
  const part = await partService.getPartById(req.params.id);
  res.status(200).json(part);
};

export const createPart = async (req, res) => {
  const part = await partService.createPart(req.body);
  res.status(201).json(part);
};
