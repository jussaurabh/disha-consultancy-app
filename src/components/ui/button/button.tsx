import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"
import { DashRing } from "../dash-ring"

/**
 * DC design system — "12 / Buttons" board (DC DESIGN SYSTEM · V1.0).
 *
 * Spec: radius 10 (rounded-lg) · Inter 600 · label 14px/18px (13px/16px on sm)
 * · heights 36 / 44 / 52 · icon buttons 44 square, 38 circle.
 * Rules: one PRIMARY cta per view · DANGER is never the primary cta.
 *
 * Variants: default (primary) · secondary/outline (quiet) · ghost (text only)
 * · destructive (danger) · destructive-outline (quiet danger) · link.
 * `size` is declared before `variant` so ghost's tighter padding wins.
 */
const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent font-body text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed aria-disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      size: {
        sm: "h-9 px-4 text-[13px] leading-4",
        default: "h-11 px-5.5 leading-[18px]",
        lg: "h-13 px-6.5 leading-[18px]",
        icon: "h-11 w-11 p-0",
        "icon-sm": "size-8 p-0",
        "icon-circle": "size-[38px] rounded-full p-0",
      },
      variant: {
        // PRIMARY — the one green cta per view
        default:
          "bg-accent text-primary-foreground not-disabled:hover:bg-accent-hover not-disabled:active:bg-accent-active disabled:opacity-40",
        // SECONDARY — outline, quiet actions on surface
        secondary:
          "border-line bg-surface text-ink not-disabled:hover:border-line-strong not-disabled:active:border-line-stronger not-disabled:active:bg-surface-pressed disabled:border-line disabled:bg-ground disabled:text-muted-foreground",
        outline:
          "border-line bg-surface text-ink not-disabled:hover:border-line-strong not-disabled:active:border-line-stronger not-disabled:active:bg-surface-pressed disabled:border-line disabled:bg-ground disabled:text-muted-foreground",
        // GHOST — text only, lowest weight
        ghost:
          "px-3 text-muted-foreground not-disabled:hover:bg-accent-soft not-disabled:hover:text-ink not-disabled:active:bg-surface-pressed not-disabled:active:text-ink disabled:opacity-40",
        // DANGER — filled, destructive
        destructive:
          "bg-danger text-danger-foreground not-disabled:hover:bg-danger-hover not-disabled:active:bg-danger-active disabled:opacity-40",
        // DANGER OUTLINE — quiet destructive
        "destructive-outline":
          "border-danger/35 bg-surface text-danger not-disabled:hover:border-danger/60 not-disabled:hover:bg-danger/5 not-disabled:active:border-danger not-disabled:active:bg-danger/10 disabled:border-line disabled:bg-ground disabled:text-muted-foreground",
        link: "text-primary underline-offset-4 not-disabled:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  loading = false,
  disabled,
  onClick,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Shows a DashedRing spinner and blocks clicks without dimming the button. */
    loading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      disabled={disabled}
      onClick={(event) => {
        if (loading) {
          event.preventDefault()
          return
        }
        onClick?.(event)
      }}
      className={cn(buttonVariants({ variant, size, className }), loading && "cursor-progress")}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? (
            <DashRing
              aria-hidden
              className={cn("shrink-0", size === "sm" ? "size-3.5" : "size-4")}
            />
          ) : null}
          {children}
        </>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
