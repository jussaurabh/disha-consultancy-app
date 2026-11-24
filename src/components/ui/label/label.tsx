import * as React from "react"
import { Label as LabelPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * DC design system — "04 / Inputs" board (DC DESIGN SYSTEM · V1.0).
 *
 * Spec: Inter 600 · 13px/16px · ink · a copper asterisk rides the text
 * when `required` is set. The asterisk is decorative — set `required` on
 * the field itself for semantics.
 */
function Label({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-1.5 font-body text-[13px] leading-4 font-semibold text-foreground select-none",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="text-copper">
          *
        </span>
      ) : null}
    </LabelPrimitive.Root>
  )
}

export { Label }
