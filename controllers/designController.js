import * as designService from "../services/designService.js";

export const createDesign = async (req, res) => {
  const design = await designService.createDesign(req.user.id, req.body);
  res.status(201).json(design);
};

export const getUserDesigns = async (req, res) => {
  const designs = await designService.getUserDesigns(req.user.id);
  res.status(200).json(designs);
};

export const getDesignById = async (req, res) => {
  const design = await designService.getDesignById(req.params.id, req.user.id);
  res.status(200).json(design);
};

export const updateDesign = async (req, res) => {
  const design = await designService.updateDesign(req.params.id, req.user.id, req.body);
  res.status(200).json(design);
};
