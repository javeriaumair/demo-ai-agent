import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <AuthShell title="Welcome Back!" subtitle="Sign in to your account">
      <LoginForm />
    </AuthShell>
  );
}
