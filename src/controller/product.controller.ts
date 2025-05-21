import { Request, Response } from "express";
import Product from "@model/product";
import handleErrorResponse from "@error/handle-error";

interface IProductCtrl {
  getAllProducts: (req: Request, res: Response) => Promise<void>;
  getProductById: (req: Request, res: Response) => Promise<void>;
  createProduct: (req: Request, res: Response) => Promise<void>;
  updateProduct: (req: Request, res: Response) => Promise<void>;
}

const productCtrl: IProductCtrl = {
  getAllProducts: async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  getProductById: async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.status(200).json(product);
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  createProduct: async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, stock, category, images } = req.body;

    if (!name || !price || !stock) {
      res.status(400).json({ error: "Name, Price and Stock are required" });
      return;
    }

    try {
      const newProduct = new Product({ name, description, price, stock, category, images });
      await newProduct.save();
      res.status(201).json({
        message: "Product Created Successfully",
        product: newProduct,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },

  updateProduct: async (req: Request, res: Response): Promise<void> => {
    const { name, description, price, stock, category, images } = req.body;

    if (!name || !price || !stock) {
      res.status(400).json({ error: "Name, Price and Stock are required" });
      return;
    }

    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { name, description, price, stock, category, images },
        { new: true, runValidators: true },
      );
      if (!updatedProduct) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
      res.status(200).json({
        message: "Product Updated Successfully",
        product: updatedProduct,
      });
    } catch (err) {
      handleErrorResponse(res, err);
    }
  },
};

export default productCtrl;
