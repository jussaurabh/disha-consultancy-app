import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function HeaderBrand({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="header-brand"
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground">
        D
      </div>
      <span className="text-base font-semibold text-foreground">Disha</span>
      <Badge variant="secondary">Consultancy</Badge>
    </div>
  );
}

export { HeaderBrand };
