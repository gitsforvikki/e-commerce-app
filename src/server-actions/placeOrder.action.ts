"use server";

import {
  createOrderService,
  ShippingAddressType,
} from "@/services/order/createOrder.service";
import { getCurrentUserData } from "@/services/user/user.service";

export const PlaceOrderActions = async (
  shippingAddress: ShippingAddressType,
) => {
  try {
    const user = await getCurrentUserData();
    if (!user) {
      throw new Error("User not found");
    }
    const { userId } = user;

    const result = await createOrderService({ userId, shippingAddress });
    return {
      success: true,
      orderId: result.order._id.toString(),
      amount: result.order.totalAmount,
    };
  } catch (err: any) {
    console.log(err);
    throw new Error("Error while placing order " + err.message);
  }
};
