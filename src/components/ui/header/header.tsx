import * as React from "react";
import { HeaderBrand } from "./header-brand";
import { HeaderNav, HeaderNavItem } from "./header-nav";
import { HeaderSearch } from "./header-search";
import { HeaderActions, HeaderBell, HeaderUser } from "./header-actions";
import { cn } from "@/lib/utils";

function HeaderRoot({
  children,
  className,
  ...props
}: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="header"
      className={cn(
        "flex h-18 w-full items-center gap-4 border-b border-border bg-white px-6",
        className,
      )}
      {...props}
    >
      {children}
    </header>
  );
}

export const Header = Object.assign(HeaderRoot, {
  Brand: HeaderBrand,
  Nav: HeaderNav,
  NavItem: HeaderNavItem,
  Search: HeaderSearch,
  Actions: HeaderActions,
  Bell: HeaderBell,
  User: HeaderUser,
});
