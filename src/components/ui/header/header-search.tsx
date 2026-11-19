import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function HeaderSearch({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="header-search"
      className={cn("relative ml-auto w-64", className)}
      {...props}
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder="Search"
        className="pl-9"
      />
    </div>
  )
}

export { HeaderSearch }