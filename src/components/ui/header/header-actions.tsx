import * as React from "react"
import { Bell, LogOut, Settings, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

function HeaderBell({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <Button variant="ghost" size="icon" data-slot="header-bell" className={cn("size-9", className)} {...props}>
      <Bell className="size-4 text-foreground" />
    </Button>
  )
}

function HeaderUser({ name = "User", className, ...props }: React.ComponentProps<"div"> & { name?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-slot="header-user-trigger"
          className={cn("flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
          {...props}
        >
          <Avatar className="size-9">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-xs text-muted-foreground">{name.toLowerCase().replace(/\s+/g, ".")}@example.com</div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { HeaderActions, HeaderBell, HeaderUser }