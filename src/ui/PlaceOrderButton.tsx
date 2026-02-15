"use client";

import { useAuth } from "@/context/auth-context";
import { PlaceOrderActions } from "@/server-actions/placeOrder.action";
import { useState } from "react";

export const PlaceOrderButton = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { firstName, lastName, phone, address } = user;
  const { home, city, state, pincode } = address;
  const shippingAddress = {
    name: firstName + " " + lastName,
    phone,
    home,
    city,
    state,
    pincode,
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      const res = await PlaceOrderActions(shippingAddress);

      console.log("Order created:", res);

      // NEXT STEP: redirect to payment
      window.location.href = `/payment?orderId=${res.orderId}`;
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePlaceOrder}
      className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
    >
      {loading ? "Placing Order..." : "Place Order"}
    </button>
  );
};
