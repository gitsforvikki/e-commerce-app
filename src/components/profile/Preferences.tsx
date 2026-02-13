import { Settings } from "lucide-react";

export const Preference = () => {
  return (
    <div className="bg-card border border-gray-300 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">Preferences</h3>
        <Settings size={20} className="text-muted-foreground" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors">
          <span className="text-foreground font-medium">
            Email Notifications
          </span>
          <input type="checkbox" defaultChecked className="w-4 h-4" />
        </div>
        <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors">
          <span className="text-foreground font-medium">Marketing Emails</span>
          <input type="checkbox" className="w-4 h-4" />
        </div>
        <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors">
          <span className="text-foreground font-medium">Order Updates</span>
          <input type="checkbox" defaultChecked className="w-4 h-4" />
        </div>
        <div className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors">
          <span className="text-foreground font-medium">
            Two-Factor Authentication
          </span>
          <input type="checkbox" className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
