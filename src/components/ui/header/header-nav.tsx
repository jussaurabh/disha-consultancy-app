import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

function HeaderNavItem({ isActive, badge, className, label, ...props }: React.ComponentProps<"a"> & { isActive?: boolean; badge?: React.ReactNode; label?: string }) {
  return (
    <a
      data-slot="header-nav-item"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium",
        isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {props.children ?? label}
      {badge && (
        <Badge variant="secondary">{badge}</Badge>
      )}
    </a>
  )
}

function HeaderNav({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="header-nav"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

export { HeaderNav, HeaderNavItem }