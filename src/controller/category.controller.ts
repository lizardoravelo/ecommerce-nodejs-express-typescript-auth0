import { Request, Response } from "express";
import Category from "@model/category";
import handleErrorResponse from "@error/handle-error";

interface ICategoryController {
  getAllCategory: (req: Request, res: Response) => Promise<void>;
  getCategoryById: (req: Request<{ id: string }>, res: Response) => Promise<void>;
  createCategory: (req: Request, res: Response) => Promise<void>;
  updateCategory: (req: Request<{ id: string }>, res: Response) => Promise<void>;
}

const categoryCtrl: ICategoryController = {
  getAllCategory: async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await Category.find();
      res.status(200).json(categories);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },
  getCategoryById: async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      res.status(200).json(category);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },
  createCategory: async (req: Request, res: Response): Promise<void> => {
    const { name, description } = req.body;

    if (!name || !description) {
      res.status(400).json({ error: "Name and description are required" });
      return;
    }

    try {
      const newCategory = await new Category({ name, description }).save();
      res.status(201).json({
        message: "Category Created Successfully",
        category: newCategory,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },
  updateCategory: async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    const { name, description } = req.body;

    if (!name || !description) {
      res.status(400).json({ error: "Name and description are required" });
      return;
    }

    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        { name, description },
        { new: true, runValidators: true }, // return the updated document and run validation
      );
      if (!updatedCategory) {
        res.status(404).json({ error: "Category not found" });
        return;
      }
      res.status(200).json({
        message: "Category Updated Successfully",
        category: updatedCategory,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },
};

export default categoryCtrl;
