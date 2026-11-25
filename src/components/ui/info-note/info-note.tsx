import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const infoNoteVariants = cva(
  "w-full rounded-sm rounded-l-none border-l-2 py-3 pr-3.5 pl-3.5 font-body text-xs leading-[1.5] text-muted-foreground",
  {
    variants: {
      variant: {
        hint: "border-copper",
        confirm: "border-accent",
        caution: "border-danger",
      },
      nested: {
        true: "bg-ground",
        false: "bg-surface",
      },
    },
    defaultVariants: { variant: "hint", nested: false },
  },
)

const titleTone = {
  hint: "text-ink",
  confirm: "text-accent",
  caution: "text-danger",
} as const

export interface InfoNoteProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof infoNoteVariants> {
  /** Small-caps heading. Tint follows the variant (ink / accent / danger). */
  title?: string
}

export function InfoNote({ className, variant = "hint", nested = false, title, children, ...props }: InfoNoteProps) {
  return (
    <div
      data-slot="info-note"
      data-variant={variant}
      className={cn(infoNoteVariants({ variant, nested }), className)}
      {...props}
    >
      {title ? (
        <p className={cn("mb-1 font-body text-[11px] font-bold uppercase leading-[14px] tracking-[0.08em]", titleTone[variant ?? "hint"])}>
          {title}
        </p>
      ) : null}
      {children}
    </div>
  )
}
