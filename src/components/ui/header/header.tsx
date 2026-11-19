import * as React from "react"
import { HeaderBrand } from "./header-brand"
import { HeaderNav, HeaderNavItem } from "./header-nav"
import { cn } from "@/lib/utils"

function HeaderRoot(props: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="header"
      className={cn("flex h-18 w-full items-center gap-4 border-b border-border bg-background px-6", props.className)}
      {...props}
    />
  )
}

export const Header = Object.assign(HeaderRoot, { Brand: HeaderBrand, Nav: HeaderNav, NavItem: HeaderNavItem })