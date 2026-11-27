import * as React from "react";
import { Checkbox } from "./checkbox";
import { cn } from "@/lib/utils";

interface CheckboxBoxProps {
  className?: string;
  children?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  id?: string;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
  value?: string;
  required?: boolean;
}

const CheckboxBox = React.forwardRef<HTMLLabelElement, CheckboxBoxProps>(
  (
    {
      className,
      children,
      checked,
      defaultChecked,
      disabled,
      id,
      onCheckedChange,
      name,
      value,
      required,
      ...props
    },
    ref,
  ) => {
    const checkboxId = id || `checkbox-box-${React.useId()}`;
    const isChecked = checked ?? defaultChecked ?? false;

    const handleChange = (newChecked: boolean) => {
      onCheckedChange?.(newChecked);
    };

    return (
      <label
        ref={ref}
        htmlFor={checkboxId}
        className={cn(
          "inline-flex items-center justify-center gap-2 px-3 py-5",
          "h-8 rounded-lg border transition-colors cursor-pointer",
          "hover:bg-accent/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-accent-soft data-[state=checked]:border-accent",
          "data-[state=unchecked]:bg-white data-[state=unchecked]:border-line",
          className,
        )}
        data-state={isChecked ? "checked" : "unchecked"}
        {...props}
      >
        <Checkbox
          id={checkboxId}
          checked={isChecked}
          onCheckedChange={handleChange}
          disabled={disabled}
          name={name}
          value={value}
          required={required}
          className="shrink-0"
          aria-hidden={!!children}
        />
        {children && (
          <span className="font-body text-sm text-ink leading-none">
            {children}
          </span>
        )}
      </label>
    );
  },
);
CheckboxBox.displayName = "CheckboxBox";

export { CheckboxBox };
