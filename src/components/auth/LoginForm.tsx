"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { noticeClass } from "@/lib/ui";
import {
  AuthDivider,
  IconField,
  PasswordField,
  SocialButtons,
  navyButtonClass,
} from "./AuthFields";

// Design only — real authentication is added with Supabase in Phase 1B.
const COMING_SOON = "Login is coming soon (Phase 1B). For now, try the dashboard!";

export function LoginForm() {
  const [notice, setNotice] = useState<string | null>(null);
  const showNotice = () => setNotice(COMING_SOON);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    showNotice();
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <IconField
          id="email"
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
        <PasswordField
          id="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
        />

        <div className="flex items-center justify-between gap-4 text-sm">
          <label className="inline-flex cursor-pointer items-center gap-2 text-foreground">
            <input
              type="checkbox"
              name="remember"
              className="size-4 cursor-pointer rounded accent-accent"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={() => setNotice("Password reset is coming soon (Phase 1B).")}
            className="font-semibold text-accent hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button type="submit" className={navyButtonClass}>
          Login
        </button>
      </form>

      <AuthDivider label="Instant Login" />
      <SocialButtons action="Login" onClick={showNotice} />

      {notice && (
        <p role="status" className={`${noticeClass} mt-6`}>
          {notice}{" "}
          <Link href="/dashboard" className="font-semibold underline">
            Open dashboard
          </Link>
        </p>
      )}

      <p className="mt-8 text-center text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-accent hover:underline">
          Sign up free
        </Link>
      </p>
    </>
  );
}
