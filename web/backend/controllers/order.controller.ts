import Order from "../models/order.schema";
import { Request, Response } from 'express';
import cron from 'node-cron';
import OrderDelivery from "../models/orderDelivery.schema";

export const takeAnOrder/* register an order */ = async (req: Request, res: Response) => {
    const orderInfo = req.body;
    if (!orderInfo.totalAmount || !orderInfo || !orderInfo.orderItems) return res.status(400).json({ msg: "Some essentials are missing" })
}

export const orderStatus = async (req: Request, res: Response) => {
    /* the restaurant admin can make an order as comfirmed,pending,delivered,cancelled*/
    const { orderStatus, orderId } = req.body;
    if (!orderStatus) return res.status(400).json({ msg: "No status selected" });
    try {
        // let us check if the  order exists /* and  */
        // let us save the updated order 

        const updatedOrder = await Order.findByIdAndUpdate(orderId);
        if (!updatedOrder) return res.status(400).json({ msg: "Order not found!" })



    } catch (error) {
        return res.status(500).json({ msg: "something went wrong" })
    }
}

export const deleteAnOrder = async (req: Request, res: Response) => {
    /*only restaurantAdmin or order owner is able to delete an order */




    const { orderId } = req.body;
    try {
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) return res.status(400).json({ msg: "Order not found" })

    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong while deleting the order" })
    }
}

// export const deleteOrdersAutomatically = async (req: Request, res: Response) => {
//     /* any engine to delete orders after 3o days after being deliverd */
//     // delivered orders
//   const order = await Order.find({});
//   if(order.orderStatus=="delivered"&& order.orderDate)
// }


// 1. The Scheduled Task (run this at startup)
// Runs daily at 00:00
cron.schedule('0 0 * * *', async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Delete orders delivered more than 30 days ago
    const result = await Order.deleteMany({
      orderStatus: 'delivered',
      deliveredAt: { $lt: thirtyDaysAgo },
    });

    console.log(`Automatically deleted ${result.deletedCount} old orders.`);
  } catch (error) {
    console.error('Error deleting old orders:', error);
  }
});

// 2. Optional: Manual Trigger Route
export const deleteOrdersAutomatically = async (req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Order.deleteMany({
      orderStatus: 'delivered',
      deliveredAt: { $lt: thirtyDaysAgo },
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} orders deleted.`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

export default { takeAnOrder };
