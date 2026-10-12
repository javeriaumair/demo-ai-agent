"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff, Lock, type LucideIcon } from "lucide-react";
import { GoogleIcon, FacebookIcon } from "@/components/icons/BrandIcons";
import { fieldClass, labelClass } from "@/lib/ui";

type IconFieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  icon: LucideIcon;
};

export function IconField({ id, label, icon: Icon, ...inputProps }: IconFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" aria-hidden />
        <input id={id} name={id} className={`${fieldClass} pl-12`} {...inputProps} />
      </div>
    </div>
  );
}

type PasswordFieldProps = Omit<ComponentProps<"input">, "type"> & {
  id: string;
  label: string;
};

export function PasswordField({ id, label, ...inputProps }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <Lock className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" aria-hidden />
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          className={`${fieldClass} pr-12 pl-12`}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-[11px] text-muted transition hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20"
        >
          {visible ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
        </button>
      </div>
    </div>
  );
}

export const navyButtonClass =
  "w-full rounded-brand bg-navy px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-navy-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/30 active:scale-[0.99]";

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="my-6 flex items-center gap-4 text-sm text-muted">
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function SocialButtons({
  action,
  onClick,
}: {
  action: "Login" | "Sign up";
  onClick: () => void;
}) {
  const socialClass =
    "flex w-full items-center justify-center gap-3 rounded-brand border border-line bg-surface px-4 py-3 font-semibold text-foreground transition hover:border-accent/40 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button type="button" onClick={onClick} className={socialClass}>
        <GoogleIcon className="size-5" />
        {action} with Google
      </button>
      <button type="button" onClick={onClick} className={socialClass}>
        <FacebookIcon className="size-5" />
        {action} with Facebook
      </button>
    </div>
  );
}
