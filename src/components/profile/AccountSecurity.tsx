export const AccountSecurity = () => {
  return (
    <div className="bg-card border border-gray-300 rounded-lg p-6 space-y-4">
      <h3 className="text-xl font-bold text-foreground">Security</h3>

      <button className="w-full flex items-center justify-between p-4 hover:bg-muted/30 rounded-lg transition-colors border border-gray-300">
        <div className="text-left">
          <p className="font-medium text-foreground">Change Password</p>
          <p className="text-sm text-muted-foreground">
            Update your password regularly for security
          </p>
        </div>
        <span className="text-muted-foreground">→</span>
      </button>

      <button className="w-full flex items-center justify-between p-4 hover:bg-muted/30 rounded-lg transition-colors border border-gray-300">
        <div className="text-left">
          <p className="font-medium text-foreground">Login History</p>
          <p className="text-sm text-muted-foreground">
            View your recent login activity
          </p>
        </div>
        <span className="text-muted-foreground">→</span>
      </button>
    </div>
  );
};
