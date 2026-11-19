"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, ChevronDown } from "lucide-react";

export type FiltersBarTab = "organizations" | "employees";

export interface FiltersBarProps {
  tab: FiltersBarTab;
  className?: string;
}

export function FiltersBar(props: FiltersBarProps): React.JSX.Element {
  const { tab, className } = props;
  const [query, setQuery] = useState("");

  const handleClear = () => {
    setQuery("");
  };

  const isOrganizations = tab === "organizations";
  const placeholder = isOrganizations ? "Search companies…" : "Search employees…";

  const dropdowns = isOrganizations
    ? [
        { label: "State", width: "w-[170px]", hasDot: false },
        { label: "Active", width: "w-[150px]", hasDot: true },
      ]
    : [
        { label: "All organizations", width: "w-[250px]", hasDot: false },
        { label: "Designation", width: "w-[170px]", hasDot: false },
      ];

  return (
    <div
      data-slot="filters-bar"
      className={cn("flex w-full items-center gap-3", className)}
    >
      <div
        data-slot="filters-bar-search"
        className="flex h-10 w-[280px] shrink-0 items-center gap-2 rounded-md border border-line bg-surface px-3"
      >
        <Search className="size-3.5 shrink-0 text-muted" />
        <input
          data-slot="filters-bar-input"
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-full w-full bg-transparent text-[13px] leading-4 text-ink outline-none placeholder:text-muted"
        />
      </div>
      {dropdowns.map((dropdown, index) => (
        <div
          key={index}
          data-slot="filters-bar-dropdown"
          className={cn(
            "flex h-10 shrink-0 items-center justify-between gap-2 rounded-md border border-line bg-surface px-3",
            dropdown.width,
          )}
        >
          <span className="text-[13px] leading-4 font-medium text-ink">
            {dropdown.hasDot && (
              <span className="flex items-center gap-[7px]">
                <span className="size-2 shrink-0 rounded-full bg-accent" />
                {dropdown.label}
              </span>
            )}
            {!dropdown.hasDot && dropdown.label}
          </span>
          <ChevronDown className="size-3 shrink-0 text-muted" />
        </div>
      ))}
      <div className="flex-1" />
      <button
        data-slot="filters-bar-clear"
        type="button"
        onClick={handleClear}
        className="text-[13px] leading-4 font-semibold text-muted transition-colors hover:text-ink"
      >
        Clear filters
      </button>
    </div>
  );
}