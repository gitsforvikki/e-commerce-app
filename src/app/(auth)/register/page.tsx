import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="pt-12 lg:pt-20 xl:pt-24 flex justify-center min-h-screen bg-blue-50">
      <RegisterForm />
    </div>
  );
}
