import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * DC design system — "04 / Inputs" board (TEXTAREA section).
 *
 * Spec: same shell as Input · 88px high at rest · top-aligned 14/18 text
 * · padding 14 x, 11 y · grows with content (field-sizing) · helper and
 * error behave like the single-line field. Pair with ui/input and ui/label.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content min-h-22 w-full resize-none rounded-lg border border-line bg-field px-3.5 py-2.75 font-body text-sm leading-[18px] text-foreground outline-none transition-[color,border-color,box-shadow] duration-150",
        "placeholder:text-muted-foreground",
        "not-disabled:not-aria-invalid:not-focus-visible:hover:border-line-strong",
        "focus-visible:border-[1.5px] focus-visible:border-primary",
        "aria-invalid:border-destructive",
        "disabled:cursor-not-allowed disabled:border-line disabled:bg-background dark:disabled:bg-muted disabled:text-muted-foreground/60 dark:disabled:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
