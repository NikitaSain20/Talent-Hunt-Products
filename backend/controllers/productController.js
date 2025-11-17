import Product from "../models/productModel.js";

export const addProduct = async (req, res) => {
  try {
    const { name, price, desc } = req.body;

    const product = await Product.create({
      name,
      price,
      desc,
      image: req.file.path,
    });

    res.json({ msg: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
