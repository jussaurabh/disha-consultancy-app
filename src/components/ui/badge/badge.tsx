import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-[22px] w-fit shrink-0 items-center justify-center gap-1.5 border border-transparent px-2.5 font-body text-[11px] font-semibold leading-[14px] tracking-[0.02em] whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&>svg]:size-3 [&>svg]:pointer-events-none [&>svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "h-[18px] gap-1 px-2 text-[10px] leading-3",
        default: "",
        lg: "h-[26px] px-3 text-xs leading-4",
      },
      variant: {
        default: "bg-accent-soft text-accent",
        solid: "bg-accent text-primary-foreground",
        secondary: "border-line bg-surface-pressed text-foreground",
        outline: "border-line text-muted-foreground",
        copper: "bg-copper-soft text-copper",
        destructive: "bg-danger-soft text-danger",
        ghost: "text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      shape: {
        pill: "rounded-full",
        tag: "rounded-sm",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      shape: "pill",
    },
  }
)

function Badge({
  className,
  variant = "default",
  size = "default",
  shape = "pill",
  dot = false,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean; dot?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-size={size}
      data-shape={shape}
      className={cn(badgeVariants({ variant, size, shape }), className)}
      {...props}
    >
      {dot ? (
        <span
          data-slot="badge-dot"
          aria-hidden
          className="size-1.5 shrink-0 rounded-full bg-current"
        />
      ) : null}
      {children}
    </Comp>
  )
}

function BadgeCount({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="badge-count"
      className={cn(
        "absolute -right-2 -top-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-copper px-[5px] font-body text-[10px] font-bold leading-3 text-primary-foreground",
        className,
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants, BadgeCount }
