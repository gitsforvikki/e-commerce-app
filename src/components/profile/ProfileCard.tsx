"use client";

import { useAuth } from "@/context/auth-context";
import { Edit2, Heart, LogOut, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

// Default avatar using initials and gradient background

export const ProfileCard = () => {
  const { user } = useAuth();
  const userName = user?.firstName + " " + user?.lastName;
  console.log("user form card", userName);
  const initials = userName
    .split(" ")
    .map((n: any) => n[0])
    .join("")
    .toUpperCase();

  const avatarColors = [
    "from-blue-400 to-purple-500",
    "from-purple-400 to-pink-500",
    "from-green-400 to-blue-500",
    "from-pink-400 to-red-500",
  ];

  const colorIndex = userName.length % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  return (
    <div className="bg-card border border-gray-300 shadow-xl rounded-lg p-6 sticky top-24 space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center space-y-4">
        <div
          className={`w-24 h-24 bg-gradient-to-br ${avatarColor} rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg`}
        >
          {initials}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{userName}</h2>
          <p className="text-sm text-muted-foreground">{user?.memberSince}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-3 border-t border-b border-slate-300 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Orders</span>
          </div>
          <span className="font-semibold text-foreground">12</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Wishlist</span>
          </div>
          <span className="font-semibold text-foreground">8</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Followers</span>
          </div>
          <span className="font-semibold text-foreground">234</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Link
          href="/orders"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium"
        >
          <ShoppingBag size={18} />
          View Orders
        </Link>
        {/* <button
            onClick={() => setIsEditing(!isEditing)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
          >
            <Edit2 size={18} />
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button> */}
      </div>

      {/* Logout Button */}
      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-destructive rounded-lg hover:bg-red-200 transition-colors font-medium">
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};
