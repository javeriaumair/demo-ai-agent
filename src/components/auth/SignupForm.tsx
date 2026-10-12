"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail, User } from "lucide-react";
import { noticeClass } from "@/lib/ui";
import {
  AuthDivider,
  IconField,
  PasswordField,
  SocialButtons,
  navyButtonClass,
} from "./AuthFields";

const MIN_PASSWORD_LENGTH = 8;

// Design only — real sign up is added with Supabase in Phase 1B.
const COMING_SOON = "Sign up is coming soon (Phase 1B). For now, try the dashboard!";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get("password") !== data.get("confirmPassword")) {
      setNotice(null);
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setNotice(COMING_SOON);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <IconField
          id="name"
          label="Full name"
          icon={User}
          type="text"
          autoComplete="name"
          placeholder="Your name"
          maxLength={80}
          required
        />
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
          autoComplete="new-password"
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          minLength={MIN_PASSWORD_LENGTH}
          required
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          minLength={MIN_PASSWORD_LENGTH}
          required
          aria-invalid={error ? true : undefined}
        />

        {error && (
          <p role="alert" className="rounded-brand bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <button type="submit" className={navyButtonClass}>
          Create Account
        </button>
      </form>

      <AuthDivider label="Instant Sign Up" />
      <SocialButtons action="Sign up" onClick={() => setNotice(COMING_SOON)} />

      {notice && (
        <p role="status" className={`${noticeClass} mt-6`}>
          {notice}{" "}
          <Link href="/dashboard" className="font-semibold underline">
            Open dashboard
          </Link>
        </p>
      )}

      <p className="mt-8 text-center text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent hover:underline">
          Login
        </Link>
      </p>
    </>
  );
}
