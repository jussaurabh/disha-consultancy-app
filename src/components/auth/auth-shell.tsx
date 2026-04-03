import type { ReactNode } from "react";
import { BrandPanel } from "@/components/auth/brand-panel";

interface AuthShellProps {
  children: ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-dvh bg-zinc-50 lg:flex">
      <div className="h-[72px] md:h-[120px] lg:h-auto lg:w-1/2">
        <BrandPanel />
      </div>

      <div className="flex min-h-[calc(100dvh-72px)] items-start justify-center px-6 py-8 md:min-h-[calc(100dvh-120px)] md:items-center md:px-8 md:py-10 lg:min-h-dvh lg:w-1/2 lg:px-8">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}
