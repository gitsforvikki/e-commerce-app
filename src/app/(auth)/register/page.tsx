import { RegisterForm } from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register - Auth",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <div className="pt-12 lg:pt-20 xl:pt-24 flex justify-center min-h-screen bg-blue-50">
      <RegisterForm />
    </div>
  );
}
