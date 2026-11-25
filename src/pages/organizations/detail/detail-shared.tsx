import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DetailSectionAction } from "@/components/ui/detail-section";

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      data-slot="detail-row"
      data-testid="detail-row"
      className="flex min-h-12 items-center gap-6 border-b border-line px-6 py-3 last:border-b-0"
    >
      <span className="w-[220px] shrink-0 text-[13px] leading-4 text-muted">
        {label}
      </span>
      {children}
    </div>
  );
}

function DetailRowValue({
  children,
  muted,
}: {
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <span
      data-slot="detail-row-value"
      className={
        muted
          ? "text-[14px] leading-[18px] text-muted"
          : "text-[14px] leading-[18px] font-semibold text-ink"
      }
    >
      {children}
    </span>
  );
}

function StatsRail({ usersTotal }: { usersTotal: number | undefined }) {
  return (
    <aside
      data-slot="stats-rail"
      className="flex w-[320px] shrink-0 flex-col gap-5"
    >
      <div
        data-slot="stats-tile"
        className="flex w-full flex-col gap-2 rounded-lg border border-line bg-surface px-6 py-5"
      >
        <span className="text-[11px] leading-[14px] font-semibold uppercase tracking-[0.09em] text-muted">
          EMPLOYEES
        </span>
        <span
          data-slot="stats-tile-value"
          data-testid="stats-tile-value"
          className="font-display text-[30px] font-extrabold leading-none tracking-[-0.02em] text-ink"
        >
          —
        </span>
        <Link
          to="/organizations?tab=employees"
          className="text-[12px] leading-4 font-semibold text-accent"
        >
          View employees →
        </Link>
      </div>
      <div
        data-slot="stats-tile"
        className="flex w-full flex-col gap-2 rounded-lg border border-line bg-surface px-6 py-5"
      >
        <span className="text-[11px] leading-[14px] font-semibold uppercase tracking-[0.09em] text-muted">
          PORTAL USERS
        </span>
        <span
          data-slot="stats-tile-value"
          data-testid="stats-tile-value"
          className="font-display text-[30px] font-extrabold leading-none tracking-[-0.02em] text-ink"
        >
          {usersTotal ?? "—"}
        </span>
      </div>
      <div
        data-slot="stats-tile"
        className="flex w-full flex-col gap-2 rounded-lg border border-line bg-surface px-6 py-5"
      >
        <span className="text-[11px] leading-[14px] font-semibold uppercase tracking-[0.09em] text-muted">
          NEXT PAYROLL
        </span>
        <span
          data-slot="stats-tile-value"
          data-testid="stats-tile-value"
          className="font-display text-[30px] font-extrabold leading-none tracking-[-0.02em] text-copper"
        >
          —
        </span>
      </div>
    </aside>
  );
}

function SectionBandActions({
  formId,
  isEditing,
  canEdit,
  isPending,
  onEditOpen,
  onEditClose,
  onReset,
}: {
  formId: string;
  isEditing: boolean;
  canEdit: boolean;
  isPending: boolean;
  onEditOpen: () => void;
  onEditClose: () => void;
  onReset: () => void;
}) {
  return isEditing ? (
    <DetailSectionAction>
      <Button
        type="button"
        variant="outline"
        size="xsm"
        onClick={() => {
          onReset();
          onEditClose();
        }}
      >
        Cancel
      </Button>
      <Button type="submit" size="xsm" disabled={isPending} form={formId}>
        Update
      </Button>
    </DetailSectionAction>
  ) : (
    <button
      type="button"
      data-slot="detail-band-edit"
      disabled={!canEdit}
      className="text-[12px] leading-4 font-semibold text-accent disabled:opacity-40"
      onClick={onEditOpen}
    >
      Edit
    </button>
  );
}

export { DetailRow, DetailRowValue, StatsRail, SectionBandActions };