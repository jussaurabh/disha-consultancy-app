import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

export type QuickActionTone = "accent" | "copper" | "neutral"

export interface QuickActionItem {
  /** Icon component rendered at 16px inside the 36px tile, e.g. a LucideIcon. */
  icon: React.ComponentType<{ className?: string }>
  label: string
  description?: string
  /** Rows render as links to this target. */
  href: string
  /** Tile tone override. Defaults to cycling accent → copper → neutral (design order). */
  tone?: QuickActionTone
}

export interface QuickActionsProps {
  title?: string
  items: QuickActionItem[]
  className?: string
}

// Tile registers from the design (dc · 01 / Dashboard · Quick actions): sage, peach, neutral.
const toneClasses: Record<QuickActionTone, string> = {
  accent: "bg-accent-soft",
  copper: "bg-copper-soft",
  neutral: "bg-ground",
}

// Rows cycle tones in the design's order: accent, copper, neutral, then repeats.
const toneCycle: QuickActionTone[] = ["accent", "copper", "neutral"]

export function QuickActions({
  title = "Quick actions",
  items,
  className,
}: QuickActionsProps): React.JSX.Element {
  return (
    <div data-slot="quick-actions" className={cn("flex w-full flex-col", className)}>
      <div
        data-slot="quick-actions-header"
        className="flex items-baseline justify-between pb-3.5"
      >
        <span className="font-display text-[18px] font-bold leading-[22px] tracking-[-0.01em] text-ink">
          {title}
        </span>
      </div>
      <div
        data-slot="quick-actions-panel"
        className="w-full overflow-hidden rounded-xl border border-line bg-surface"
      >
        {items.map((item, index) => {
          const Icon = item.icon
          const tone = item.tone ?? toneCycle[index % toneCycle.length]
          return (
            <Link
              key={index}
              to={item.href}
              data-slot="quick-action"
              data-tone={tone}
              className={cn(
                "flex w-full items-center gap-[14px] px-5 py-[18px] text-left outline-none transition-colors",
                "hover:bg-surface-pressed focus-visible:bg-surface-pressed",
                "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50",
                index > 0 && "border-t border-line",
              )}
            >
              <span
                data-slot="quick-action-icon"
                aria-hidden="true"
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-[10px] text-ink",
                  toneClasses[tone],
                )}
              >
                <Icon className="size-4" />
              </span>
              <span
                data-slot="quick-action-text"
                className="flex min-w-0 flex-1 flex-col gap-0.5"
              >
                <span className="font-body text-sm font-semibold leading-[18px] text-ink">
                  {item.label}
                </span>
                {item.description && (
                  <span className="font-body text-xs leading-4 text-muted">
                    {item.description}
                  </span>
                )}
              </span>
              {/* 14×14 chevron, exact design path (dc · Quick actions) */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
                className="shrink-0 text-muted"
              >
                <path
                  d="M5 3L9 7L5 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// 16×16 stroke icons traced from the design (dc · 01 / Dashboard · Quick actions).
// They draw with currentColor so tiles stay theme-aware in light and dark.

export function AddOrganizationIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path
        d="M3 13.5V4.5C3 3.7 3.7 3 4.5 3H7V13.5H3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M9 3H11.5C12.3 3 13 3.7 13 4.5V13.5H9V3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function InviteUserIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="6.5" cy="5.5" r="2.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M2.5 13C3 10.9 4.6 9.7 6.5 9.7C8.4 9.7 10 10.9 10.5 13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M12.5 5.5V9.5M10.5 7.5H14.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function CreateRoleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="5.2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
