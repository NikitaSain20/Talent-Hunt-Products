import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import User from "../models/userModel.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(400).json({ msg: "Cart is empty" });

    const order = await Order.create({
      userId,
      items: cart.items,
      totalAmount: cart.totalAmount,
    });

    await Cart.deleteOne({ userId });

    res.json({ msg: "Order placed successfully", orderId: order._id });
  } catch (error) {
    res.status(500).json({ msg: "Error placing order", error: error.message });
  }
};

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    const ordersWithUserInfo = await Promise.all(
      orders.map(async (order) => {
        const user = await User.findById(order.userId);
        return {
          ...order.toObject(),
          userName: user ? user.name : "Unknown",
        };
      })
    );
    res.json(ordersWithUserInfo);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching orders", error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching user orders", error: error.message });
  }
};
