import * as React from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

function HeaderActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="header-actions"
      className={cn("flex items-center gap-4", className)}
      {...props}
    />
  )
}

function HeaderBell({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <Button variant="ghost" size="icon" data-slot="header-bell" className={cn("size-9", className)} {...props}>
      <Bell className="size-4" />
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
    <div data-slot="header-user" className={cn("flex items-center gap-2", className)} {...props}>
      <Avatar className="size-9">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    </div>
  )
}

export { HeaderActions, HeaderBell, HeaderUser }