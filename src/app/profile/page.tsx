import { AccountSecurity } from "@/components/profile/AccountSecurity";
import { Preference } from "@/components/profile/Preferences";
import { ProfileCard } from "@/components/profile/ProfileCard";
import ProfileForm from "@/components/profile/ProfileForm";
import { ProfileMainPAge } from "@/components/profile/ProfileMain";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-semibold">My Profile</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile card */}
            <div className="lg:col-span-1">
              <ProfileCard />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileMainPAge />
              <Preference />
              <AccountSecurity />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
