import * as React from "react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export interface SecondaryHeaderSegment {
  label: string;
  url?: string;
}

export interface SecondaryHeaderBadge {
  text: string;
  tone: "accent" | "danger";
}

const softTones = {
  accent: { dot: "bg-accent", text: "text-accent", bg: "bg-accent-soft" },
  danger: {
    dot: "bg-destructive",
    text: "text-destructive",
    bg: "bg-destructive/10",
  },
} as const;

function SecondaryHeaderRoot({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="secondary-header"
      className={cn(
        "flex min-h-14 w-full items-center gap-4 border-b border-border bg-card px-10 py-4",
        className,
      )}
      {...props}
    />
  );
}

function SecondaryHeaderBack({
  label,
  onClick,
}: {
  label?: string;
  onClick?: () => void;
}) {
  const navigate = useNavigate();
  const handleClick = onClick ?? (() => navigate(-1));

  return (
    <button
      type="button"
      data-slot="secondary-header-back"
      aria-label="Go back"
      onClick={handleClick}
      className={cn(
        "flex size-5 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground",
      )}
    >
      <ChevronLeft className="size-3.5" />
      {label && (
        <span className="text-[13px] leading-4 font-medium text-muted-foreground">
          {label}
        </span>
      )}
    </button>
  );
}

function SecondaryHeaderBreadcrumb({
  segments,
}: {
  segments: SecondaryHeaderSegment[];
}) {
  return (
    <div
      data-slot="secondary-header-breadcrumb"
      aria-label="Breadcrumb"
      className="flex items-center gap-2.5"
    >
      {segments.map((segment, i) => {
        if (i > 0) {
          return (
            <span
              key={`sep-${i}`}
              className="text-[13px] leading-4 text-muted-foreground/50"
            >
              /
            </span>
          );
        }

        if (segment.url) {
          return (
            <Link
              key={segment.url}
              className="text-[13px] leading-4 font-medium text-muted-foreground hover:text-foreground"
              to={segment.url}
            >
              {segment.label}
            </Link>
          );
        }

        return (
          <span
            key={segment.label}
            className="text-[13px] leading-4 font-medium text-muted-foreground"
          >
            {segment.label}
          </span>
        );
      })}
    </div>
  );
}

function SecondaryHeaderDivider(): React.ReactElement {
  return (
    <span
      data-slot="secondary-header-divider"
      className="h-5 w-px shrink-0 bg-border"
    />
  );
}

function SecondaryHeaderTitle({
  avatar,
  name,
  badge,
}: {
  avatar?: string;
  name: string;
  badge?: SecondaryHeaderBadge;
}) {
  return (
    <div data-slot="secondary-header-title" className="flex items-center gap-3">
      {avatar && (
        <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft font-display text-base font-bold leading-5 text-accent">
          {avatar}
        </span>
      )}
      <span className="font-display text-xl font-bold leading-6 tracking-[-0.01em] text-foreground">
        {name}
      </span>
      {badge && (
        <span
          className={cn(
            "flex items-center gap-[7px] rounded-full px-2.5 py-1 text-[11px] leading-3.5 font-semibold",
            softTones[badge.tone].bg,
          )}
        >
          <span className={cn("size-1.5 shrink-0 rounded-full", softTones[badge.tone].dot)} />
          <span className={softTones[badge.tone].text}>{badge.text}</span>
        </span>
      )}
    </div>
  );
}

function SecondaryHeaderPill({
  text,
  tone = "copper",
}: {
  text: string;
  tone?: "copper" | "accent" | "danger";
}) {
  if (tone === "copper") {
    return (
      <span className="flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-[#B0653A]" />
        <span className="text-[11px] leading-3.5 font-semibold tracking-[0.04em] text-muted-foreground">
          {text}
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex items-center gap-[7px] rounded-full px-2.5 py-1",
        softTones[tone].bg,
      )}
    >
      <span className={softTones[tone].dot} />
      <span className={softTones[tone].text}>{text}</span>
    </span>
  );
}

function SecondaryHeaderActions({ children }: { children?: React.ReactNode }) {
  return (
    <div
      data-slot="secondary-header-actions"
      className="ml-auto flex items-center gap-2.5"
    >
      {children}
    </div>
  );
}

export const SecondaryHeader = Object.assign(SecondaryHeaderRoot, {
  Back: SecondaryHeaderBack,
  Breadcrumb: SecondaryHeaderBreadcrumb,
  Divider: SecondaryHeaderDivider,
  Title: SecondaryHeaderTitle,
  Pill: SecondaryHeaderPill,
  Actions: SecondaryHeaderActions,
});
