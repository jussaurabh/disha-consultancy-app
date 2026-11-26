import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * DC design system — "04 / Inputs" board (DC DESIGN SYSTEM · V1.0).
 *
 * Spec: height 42 · radius 10 (rounded-lg) · Inter 400 14/18 · padding-x 14
 * · 1px line border · focus = accent border 1.5px · invalid dyes the border
 * copper-red · disabled sinks to the ground/raised fill with lifted muted
 * text. Helper rides 8 under the field; label and messages see ui/label.
 * Pair with ui/textarea for the multi-line shell.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10.5 w-full min-w-0 rounded-lg border border-line bg-field px-3.5 py-1 font-body text-sm leading-[18px] text-foreground outline-none transition-[color,border-color,box-shadow] duration-150",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "not-disabled:not-aria-invalid:not-focus-visible:hover:border-line-strong",
        "focus-visible:border-[1.5px] focus-visible:border-primary",
        "aria-invalid:border-destructive",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-line disabled:bg-background dark:disabled:bg-muted disabled:text-muted-foreground/60 dark:disabled:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Password field with a show/hide toggle icon.
 * Renders Input on the 42px shell with an Eye/EyeOff affix on the right.
 * Toggles type between "password" and "text" on click.
 */
function PasswordInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [show, setShow] = React.useState(false);

  return (
    <div className="relative w-full">
      <Input
        className={cn("pr-10", className)}
        type={show ? "text" : "password"}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
    </div>
  );
}

export { Input, PasswordInput };
