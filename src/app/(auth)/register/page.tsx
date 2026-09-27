import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Create an Account - ShopHub",
  description: "Join ShopHub for verified brand collections, express delivery, and seamless returns.",
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-[calc(100vh-16rem)] flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-slate-50/80 dark:bg-slate-950 transition-colors duration-200 overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      <RegisterForm />
    </div>
  );
}
