import { Mail, MapPin, Phone, User } from "lucide-react";

export const AccountInfo = () => {
  return (
    <div className="space-y-4">
      {/* Display Mode */}
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <User size={20} className="text-primary shrink-0" />
        <div>
          <p className="text-sm text-muted-foreground">Full Name</p>
          {/* <p className="font-semibold text-foreground">{userInfo.name}</p> */}
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <Mail size={20} className="text-primary shrink-0" />
        <div>
          <p className="text-sm text-muted-foreground">Email Address</p>
          {/* <p className="font-semibold text-foreground">{userInfo.email}</p> */}
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <Phone size={20} className="text-primary shrink-0" />
        <div>
          <p className="text-sm text-muted-foreground">Phone Number</p>
          {/* <p className="font-semibold text-foreground">{userInfo.phone}</p> */}
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <MapPin size={20} className="text-primary shrink-0" />
        <div>
          <p className="text-sm text-muted-foreground">Address</p>
          {/* <p className="font-semibold text-foreground">{userInfo.address}</p> */}
        </div>
      </div>
    </div>
  );
};
