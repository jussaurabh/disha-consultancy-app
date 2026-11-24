import { Outlet } from "react-router-dom";
import { SiteHeader } from "./site-header";

export function AppShell() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 overflow-auto bg-ground">
        <Outlet />
      </main>
    </>
  );
}
