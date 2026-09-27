import { AccountSecurity } from "@/components/profile/AccountSecurity";
import { Preference } from "@/components/profile/Preferences";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ProfileMainPAge } from "@/components/profile/ProfileMain";
import Link from "next/link";
import { routes } from "@/utils/routes";
import { ChevronRight, ShieldCheck, UserCheck } from "lucide-react";

export const metadata = {
  title: "My Profile & Settings | ShopHub",
  description: "Manage your personal information, delivery addresses, security, and preferences on ShopHub.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
          <Link
            href={routes.HOME}
            className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Home
          </Link>
          <ChevronRight size={14} className="shrink-0 text-slate-400" />
          <span className="text-slate-900 dark:text-white font-bold">
            My Profile
          </span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/40 text-violet-700 dark:text-violet-300 text-xs font-bold mb-1">
              <UserCheck size={14} />
              <span>Personal Account Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              My Profile & Settings
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              Manage your personal information, default delivery address, preferences, and account security credentials.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold shadow-xs self-start md:self-auto shrink-0">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>256-Bit SSL Encrypted Account</span>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Profile Sidebar Card */}
          <div className="lg:col-span-4">
            <ProfileCard />
          </div>

          {/* Main Content Sections */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <ProfileMainPAge />
            <Preference />
            <AccountSecurity />
          </div>
        </div>
      </div>
    </div>
  );
}
