"use client";

import { useAuth } from "@/context/auth-context";
import { Mail, MapPin, Phone, User } from "lucide-react";

export const DisplayUser = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
        <User size={20} className="text-indigo-600 font-bold shrink-0" />
        <div>
          <p className="text-sm text-muted-foreground">Full Name</p>
          <p className="font-semibold text-foreground">
            {user?.firstName + " " + user?.lastName}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
        <Mail size={20} className="text-indigo-600 font-bold shrink-0" />
        <div>
          <p className="text-sm text-muted-foreground">Email Address</p>
          <p className="font-semibold text-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
        <Phone size={20} className="text-indigo-600 font-bold  shrink-0" />
        <div>
          <p className="text-sm text-muted-foreground">Phone Number</p>
          <p className="font-semibold text-foreground">{user?.phone}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-lg">
        <MapPin size={20} className="text-indigo-600 font-bold shrink-0" />
        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          <p className="font-semibold text-foreground">{user?.address.city}</p>
        </div>
      </div>
    </div>
  );
};
