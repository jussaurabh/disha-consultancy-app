import * as React from "react"
import { Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { cn } from "@/lib/utils"

function HeaderActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="header-actions"
      className={cn("ml-auto flex items-center gap-4", className)}
      {...props}
    />
  )
}

function HeaderBell({
  className,
  ...props
}: Omit<React.ComponentProps<"button">, "ref">) {
  return (
    <Button variant="ghost" size="icon" data-slot="header-bell" className={cn("size-9", className)} {...props}>
      <Bell className="size-4 text-foreground" />
    </Button>
  )
}

function getInitials(value: string): string {
  const base = value.includes("@") ? value.split("@")[0] : value
  const parts = base.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  const single = parts[0] ?? ""
  return single.slice(0, 2).toUpperCase()
}

function HeaderUser({
  name = "User",
  email,
  subtitle,
  onLogout,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  name?: string
  /** Signed-in email; shown in the menu and used for the avatar initials */
  email?: string
  /** Small secondary line in the menu, e.g. the account type */
  subtitle?: string
  /** Renders a destructive "Log out" item when provided */
  onLogout?: () => void
}) {
  const displayName = email ?? name
  const initials = getInitials(displayName)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-slot="header-user-trigger"
          aria-label="Open user menu"
          className={cn("flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
          {...props}
        >
          <Avatar className="size-9">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5">
          <span className="truncate text-sm font-medium">{displayName}</span>
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </DropdownMenuLabel>
        {onLogout && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} variant="destructive">
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { HeaderActions, HeaderBell, HeaderUser }