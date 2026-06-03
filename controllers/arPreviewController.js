import * as arPreviewService from "../services/arPreviewService.js";

export const createArPreview = async (req, res) => {
  const doc = await arPreviewService.createArPreview(req.user.id, req.body);
  res.status(201).json(doc);
};

export const getUserArPreviews = async (req, res) => {
  const list = await arPreviewService.getUserArPreviews(req.user.id);
  res.status(200).json(list);
};

export const getArPreviewById = async (req, res) => {
  const doc = await arPreviewService.getArPreviewById(req.params.id, req.user.id);
  res.status(200).json(doc);
};

export const updateArPreview = async (req, res) => {
  const doc = await arPreviewService.updateArPreview(req.params.id, req.user.id, req.body);
  res.status(200).json(doc);
};

export const deleteArPreview = async (req, res) => {
  await arPreviewService.deleteArPreview(req.params.id, req.user.id);
  res.status(200).json({ message: "AR preview deleted" });
};
