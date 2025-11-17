import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + item.price * item.qty, 0);
};

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [
          {
            productId,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: quantity,
          },
        ],
        totalAmount: product.price * quantity,
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.qty += quantity;
      } else {
        cart.items.push({
          productId,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: quantity,
        });
      }

      cart.totalAmount = calculateTotal(cart.items);
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding to cart", error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.productId === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.productId !== productId);
    } else {
      item.qty = quantity;
    }

    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating cart item", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);
    cart.totalAmount = calculateTotal(cart.items);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing from cart", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

export const viewCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) {
      return res.json({ userId: req.params.userId, items: [], totalAmount: 0 });
    }
    res.json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};
