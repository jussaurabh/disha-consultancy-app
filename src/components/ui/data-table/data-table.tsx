import { cn } from "@/lib/utils"
import { Skeleton } from "../skeleton"

export interface DataTableColumn<T> {
  key: string
  header: string
  /** Tailwind classes for the cell wrapper, e.g. "w-36 shrink-0" or "min-w-0 truncate" */
  className?: string
  cell: (row: T) => React.ReactNode
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  // maxHeight: number, // TODO: implement sticky header
  emptyState,
  isLoading = false,
  skeletonRows = 5,
}: {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  /** Max height in px for the scroll container; header stays sticky */
  maxHeight?: number
  emptyState?: React.ReactNode
  isLoading?: boolean
  skeletonRows?: number
}): React.JSX.Element {
  // Render skeleton rows while loading
  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg p-8">
        <div className="space-y-2">
          {Array.from({ length: skeletonRows }, (_, i) => (
            <div key={i} className="h-4 flex items-center gap-2">
              {columns.map((col) => (
                <Skeleton className={cn("w-full", col.className)} data-testid={`skeleton-${col.key}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Render empty state when no rows
  if (rows.length === 0) {
    return (
      <div className="bg-surface rounded-lg p-8">
        {emptyState || (
          <p className="font-body text-sm text-muted text-center py-8">
            No organizations yet
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-lg overflow-hidden">
      {/* Header row */}
      <div className="border-b border-line">
        <div className="flex items-center h-10">
          {columns.map((col) => (
            <span
              key={col.key}
              className={cn(
                "font-body text-[11px] font-semibold uppercase tracking-[0.09em] text-muted p-2 w-full",
                col.className
              )}
            >
              {col.header}
            </span>
          ))}
          {onRowClick && <span className="w-6 shrink-0" aria-hidden="true" />}
        </div>
      </div>

      {/* Data rows */}
      <div className="flex flex-col space-y-1 overflow-y-auto">
        {rows.map((row) => (
          <div
            key={rowKey(row)}
            className={cn(
              "flex items-center h-14 border-b border-line last:border-b-0 hover:bg-accent-soft/40 cursor-pointer",
              onRowClick && "cursor-pointer",
              !onRowClick && "cursor-default"
            )}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            data-testid={`row-${rowKey(row)}`}
          >
            {columns.map((col) => {
              const Cell = col.cell
              const className = col.className || ""
              return (
                <span
                  key={col.key}
                  className={cn("p-2 align-middle", "w-full", className)}
                  data-testid={`cell-${col.key}`}
                >
                  {Cell(row)}
                </span>
              )
            })}
            {onRowClick && (
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-6 h-6 text-muted ml-auto"
                style={{ flexShrink: 0 }}
                data-testid="row-arrow"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}