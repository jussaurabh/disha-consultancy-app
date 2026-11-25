"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface FormPanelProps extends React.ComponentProps<"section"> {
  /** Small-caps copper kicker, rendered uppercase, e.g. "Step 2 of 6 — Contact" */
  eyebrow?: string;
  /** Panel heading, e.g. "Contact & address" */
  title: string;
  /** Muted line under the title */
  description?: string;
  /** Right side of the header, e.g. <><Clock aria-hidden /> Takes ~2 minutes</> */
  meta?: React.ReactNode;
  /** Bottom note slot inside the body, e.g. an <InfoNote nested> */
  note?: React.ReactNode;
}

interface FormPanelSectionProps extends React.ComponentProps<"div"> {
  /** Section title (copper uppercase label) */
  title: string;
  /** Layout direction for fields */
  layout?: "vertical" | "horizontal";
  children: React.ReactNode;
}

interface FormPanelFieldProps extends React.ComponentProps<"input"> {
  /** Field label */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Input type */
  type?: string;
}

interface FormPanelFieldRowProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/* FormPanelField – forwardRef for react-hook-form                    */
/* ------------------------------------------------------------------ */

const FormPanelField = React.forwardRef<HTMLInputElement, FormPanelFieldProps>(
  ({ label, placeholder, type = "text", className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full min-w-0">
        <span className="font-body text-xs leading-4 text-muted-foreground">{label}</span>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          data-slot="form-panel-field"
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
      </div>
    );
  },
);

FormPanelField.displayName = "FormPanelField";

/* ------------------------------------------------------------------ */
/* FormPanelFieldRow – explicit row wrapper                           */
/* ------------------------------------------------------------------ */

function FormPanelFieldRow({ children, className, ...props }: FormPanelFieldRowProps) {
  return (
    <div
      className={cn("flex flex-wrap gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FormPanelSection – vertical or horizontal layout                   */
/* ------------------------------------------------------------------ */

function FormPanelSection({ title, layout = "vertical", children, className, ...props }: FormPanelSectionProps) {
  const isHorizontal = layout === "horizontal";

  return (
    <div
      data-slot="form-panel-section"
      className={cn(
        "flex flex-col gap-3",
        isHorizontal && "md:flex-row md:items-start",
        className,
      )}
      {...props}
    >
      <p className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.1em] text-copper shrink-0 md:w-[160px]">
        {title}
      </p>
      <div
        className={cn(
          "flex flex-col gap-3 w-full",
          isHorizontal && "md:flex-row md:gap-4 md:items-start",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FormPanelSeparator – uses shared Separator component              */
/* ------------------------------------------------------------------ */

function FormPanelSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator className={cn("border-line", className)} {...props} />;
}

/* ------------------------------------------------------------------ */
/* FormPanel – main component                                         */
/* ------------------------------------------------------------------ */

export function FormPanel({
  eyebrow,
  title,
  description,
  meta,
  note,
  className,
  children,
  ...props
}: FormPanelProps) {
  return (
    <section
      data-slot="form-panel"
      className={cn("rounded-lg border border-line bg-surface", className)}
      {...props}
    >
      <div
        data-slot="form-panel-header"
        className="flex items-start justify-between gap-6 border-b border-line px-8 pt-[26px] pb-[22px]"
      >
        <div className="flex min-w-0 flex-col gap-1">
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase leading-[14px] tracking-[0.1em] text-copper">
              {eyebrow}
            </p>
          )}
          <div className="font-display text-[21px] font-extrabold leading-[26px] tracking-[-0.01em] text-ink">
            {title}
          </div>
          {description && (
            <p className="text-[13px] leading-4 text-muted-foreground">{description}</p>
          )}
        </div>
        {meta && (
          <div
            data-slot="form-panel-meta"
            className="flex shrink-0 items-center gap-1.5 text-xs leading-4 text-muted-foreground [&_svg]:size-3.5"
          >
            {meta}
          </div>
        )}
      </div>
      <div data-slot="form-panel-body" className="px-8 pt-[26px] pb-[30px]">
        {children}
        {note && (
          <div data-slot="form-panel-note" className="mt-6">
            {note}
          </div>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Compound component attachment                                      */
/* ------------------------------------------------------------------ */

FormPanel.Section = FormPanelSection;
FormPanel.Separator = FormPanelSeparator;
FormPanel.Field = FormPanelField;
FormPanel.Field.Row = FormPanelFieldRow;

export { FormPanelSection, FormPanelSeparator, FormPanelField, FormPanelFieldRow };
export type { FormPanelSectionProps, FormPanelSeparatorProps, FormPanelFieldProps, FormPanelFieldRowProps };