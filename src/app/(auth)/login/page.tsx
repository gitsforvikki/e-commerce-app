import { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login - Auth",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="pt-12 lg:pt-20 xl:pt-24 flex justify-center min-h-screen bg-blue-50">
      <LoginForm />
    </div>
  );
}
