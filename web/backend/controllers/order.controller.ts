import { Request, Response } from 'express';
import cron from 'node-cron';
import Order from "../models/order.schema";
import Item from "../models/items.schemas";
import { RestaurantAnalytics } from "../models/analytics.schema";

const getTodayUTC = () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return today;
};

export const takeAnOrder = async (req: Request, res: Response) => {
  const orderInfo = req.body;

  if (!orderInfo || !orderInfo.totalAmount || !orderInfo.orderItems) {
    return res.status(400).json({ msg: "Some essentials are missing" });
  }

  try {
    const newOrder = new Order({
      ...orderInfo,
      orderStatus: 'pending'
    });
    const savedOrder = await newOrder.save();

    const today = getTodayUTC();
    const currentHour = new Date().getHours();

    await RestaurantAnalytics.updateOne(
      { restaurantId: savedOrder.restaurantId, date: today },
      {
        $inc: { totalOrders: 1 },
        $setOnInsert: { date: today, restaurantId: savedOrder.restaurantId }
      },
      { upsert: true }
    );

    await RestaurantAnalytics.updateOne(
      {
        restaurantId: savedOrder.restaurantId,
        date: today,
        "hourlyPerformance.hour": currentHour
      },
      {
        $inc: { "hourlyPerformance.$.orderCount": 1 }
      }
    ).then(async (result) => {
      if (result.matchedCount === 0) {
        await RestaurantAnalytics.updateOne(
          { restaurantId: savedOrder.restaurantId, date: today },
          {
            $push: {
              hourlyPerformance: { hour: currentHour, revenue: 0, orderCount: 1 }
            }
          }
        );
      }
    });

    return res.status(201).json({ msg: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Something went wrong while placing the order" });
  }
};

export const orderStatus = async (req: Request, res: Response) => {
  const { orderStatus, orderId } = req.body;
  if (!orderStatus) return res.status(400).json({ msg: "No status selected" });

  try {
    const existingOrder = await Order.findById(orderId).populate('orderItems');
    if (!existingOrder) return res.status(404).json({ msg: "Order not found!" });

    const oldStatus = existingOrder.orderStatus;
    existingOrder.orderStatus = orderStatus;

    if (orderStatus === 'delivered') {
      existingOrder.deliveredAt = new Date();
    }
    const updatedOrder = await existingOrder.save();

    const today = getTodayUTC();
    const currentHour = new Date().getHours();

    if (orderStatus === 'delivered' && oldStatus !== 'delivered') {
      let prepTime = 0;
      if (updatedOrder.deliveredAt && updatedOrder.createdAt) {
        prepTime = Math.round((updatedOrder.deliveredAt.getTime() - updatedOrder.createdAt.getTime()) / 60000);
      }

      // Process popular items updates
      const itemUpdates = updatedOrder.orderItems.map((item: any) => ({
        updateOne: {
          filter: {
            restaurantId: updatedOrder.restaurantId,
            date: today,
            "popularItems.menuItemId": item._id
          },
          update: {
            $inc: {
              "popularItems.$.quantitySold": item.quantity || 1,
              "popularItems.$.revenueGenerated": (item.price || 0) * (item.quantity || 1)
            }
          }
        }
      }));

      await RestaurantAnalytics.updateOne(
        { restaurantId: updatedOrder.restaurantId, date: today },
        {
          $inc: {
            totalRevenue: updatedOrder.totalAmount,
            completedOrders: 1,
            avgPreparationTimeMin: prepTime
          }
        },
        { upsert: true }
      );

      await RestaurantAnalytics.updateOne(
        { restaurantId: updatedOrder.restaurantId, date: today, "hourlyPerformance.hour": currentHour },
        { $inc: { "hourlyPerformance.$.revenue": updatedOrder.totalAmount } }
      );

      // Execute bulk updates for existing popular items
      if (itemUpdates.length > 0) {
        await RestaurantAnalytics.bulkWrite(itemUpdates);

        // Add new popular items that don't exist yet
        for (const item of updatedOrder.orderItems) {
          const existingAnalytics = await RestaurantAnalytics.findOne({
            restaurantId: updatedOrder.restaurantId,
            date: today,
            "popularItems.menuItemId": item._id
          });

          // Only push if item not already in popularItems array
          if (!existingAnalytics) {
            await RestaurantAnalytics.updateOne(
              {
                restaurantId: updatedOrder.restaurantId,
                date: today
              },
              {
                $push: {
                  popularItems: {
                    menuItemId: item._id,
                    name: item.name,
                    quantitySold: item.quantity || 1,
                    revenueGenerated: (item.price || 0) * (item.quantity || 1)
                  }
                }
              }
            );
          }
        }
      }
    } else if (orderStatus === 'cancelled' && oldStatus !== 'cancelled') {
      await RestaurantAnalytics.updateOne(
        { restaurantId: updatedOrder.restaurantId, date: today },
        { $inc: { cancelledOrders: 1 } }
      );
    }

    return res.status(200).json({ msg: `Order marked as ${orderStatus}`, order: updatedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "something went wrong" });
  }
};

export const deleteAnOrder = async (req: Request, res: Response) => {
  const { orderId } = req.body;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) return res.status(404).json({ msg: "Order not found" });

    return res.status(200).json({ msg: "Order deleted successfully", deletedOrder });
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong while deleting the order" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const orderId =
    (req.params as { orderId?: string }).orderId || (req.body as { orderId?: string })?.orderId;

  if (!orderId) {
    return res.status(400).json({ msg: "orderId is required" });
  }

  try {
    const orderExists = await Order.findById(orderId)
      .populate("userId", "firstName lastName email userName")
      .populate("restaurantId", "name emailAddress")
      .populate("orderItems");
    if (!orderExists) return res.status(404).json({ msg: "The requested order does not exist" });

    return res.status(200).json({ order: orderExists });
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong finding the order" });
  }
};

export const listOrders = async (req: Request, res: Response) => {
  try {
    const { restaurantId, page = "1", limit = "25", orderStatus, userId } = req.query;
    const filter: Record<string, unknown> = {};
    if (restaurantId) filter.restaurantId = restaurantId;
    if (orderStatus) filter.orderStatus = orderStatus;
    if (userId) filter.userId = userId;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 25));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("userId", "firstName lastName email userName")
        .populate("restaurantId", "name emailAddress")
        .populate("orderItems"),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({ orders, total, page: pageNum, limit: limitNum });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Something went wrong while listing orders" });
  }
};

export const updateOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId, ...updateData } = req.body;
    const orderExistsAndUpdated = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

    if (!orderExistsAndUpdated) return res.status(404).json({ msg: "Order not found" });
    return res.status(200).json({ msg: "order updated successfully", order: orderExistsAndUpdated });
  } catch (error) {
    console.error(`Error: ${error}`);
    return res.status(500).json({ msg: "something went wrong" });
  }
};

cron.schedule('0 0 * * *', async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Order.deleteMany({
      orderStatus: 'delivered',
      deliveredAt: { $lt: thirtyDaysAgo },
    });

    console.log(`Automatically deleted ${result.deletedCount} old orders.`);
  } catch (error) {
    console.error('Error deleting old orders:', error);
  }
});

export const deleteOrdersAutomatically = async (req: Request, res: Response) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Order.deleteMany({
      orderStatus: 'delivered',
      deliveredAt: { $lt: thirtyDaysAgo },
    });

    return res.status(200).json({
      success: true,
      message: `${result.deletedCount} orders deleted.`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error });
  }
};

export default {
  takeAnOrder,
  getOrderById,
  listOrders,
  orderStatus,
  deleteAnOrder,
  updateOrderById,
  deleteOrdersAutomatically
};