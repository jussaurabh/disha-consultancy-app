import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlocker } from "react-router-dom";
import type { ComponentType } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SecondaryHeader } from "@/components/ui/secondary-header";
import { PageHeader } from "@/components/ui/page-header";
import { Stepper } from "@/components/ui/stepper";
import { InfoNote } from "@/components/ui/info-note";
import { StickyActionBar } from "@/components/ui/sticky-action-bar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { STEPS, panelHeaderProps, type StepKey } from "./new-shared";
import { CompanyPanel, COMPANY_DEFAULTS } from "./company-panel";
import { ContactPanel, CONTACT_DEFAULTS } from "./contact-panel";
import { BankPanel, BANK_DEFAULTS } from "./bank-panel";
import { PayrollPanel, PAYROLL_DEFAULTS } from "./payroll-panel";
import { PfPanel, PF_DEFAULTS } from "./pf-panel";
import { EsiPanel, ESI_DEFAULTS } from "./esi-panel";
import { readDraft, clearDraft, isDraftDirty } from "@/lib/org-new-draft";

const PANEL_COMPONENTS: Record<StepKey, ComponentType> = {
  Company: CompanyPanel,
  Contact: ContactPanel,
  Bank: BankPanel,
  Payroll: PayrollPanel,
  PF: PfPanel,
  ESI: EsiPanel,
};

const DEFAULTS_BY_STEP: Record<StepKey, Record<string, string | boolean>> = {
  Company: COMPANY_DEFAULTS,
  Contact: CONTACT_DEFAULTS,
  Bank: BANK_DEFAULTS,
  Payroll: PAYROLL_DEFAULTS,
  PF: PF_DEFAULTS,
  ESI: ESI_DEFAULTS,
};

export default function NewOrganizationPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const step = STEPS[current];
  const isLast = current === STEPS.length - 1;
  const filledSegments = Math.min(current + 1, STEPS.length - 1);

  const blocker = useBlocker(() => isDraftDirty(DEFAULTS_BY_STEP));

  const goToStep = (index: number) =>
    setCurrent(Math.max(0, Math.min(STEPS.length - 1, index)));
  const advance = () => goToStep(current + 1);

  const handleCreate = () => {
    console.log(readDraft());
  };

  const Panel = PANEL_COMPONENTS[step.key];

  return (
    <div className="flex min-h-full flex-col">
      <SecondaryHeader>
        <SecondaryHeader.Back />
        <SecondaryHeader.Breadcrumb
          segments={[
            { label: "Organizations", url: "/organizations" },
            { label: "New organization" },
          ]}
        />
        <SecondaryHeader.Actions>
          <span className="rounded-full border border-line bg-ground px-2.5 py-[5px]">
            <SecondaryHeader.Pill text="DRAFT · NOT SAVED" />
          </span>
        </SecondaryHeader.Actions>
      </SecondaryHeader>

      <PageHeader
        variant="form"
        eyebrow="CLIENT COMPANIES — NEW RECORD"
        title="Create organization"
        description="Register a client company, then configure payroll, statutory and banking setup."
        actions={
          <Button variant="ghost" onClick={() => navigate("/organizations")}>
            Cancel
          </Button>
        }
      />

      <div className="grid flex-1 items-start gap-7 px-4 pt-6 pb-8 md:grid-cols-[268px_1fr] md:px-6">
        <div>
          <Stepper
            steps={STEPS.map((s) => ({ title: s.short, subtitle: s.subtitle }))}
            current={current}
          />
          <InfoNote className="mt-3.5">
            Optional sections can be completed later from the organization
            page.
          </InfoNote>
        </div>

        <Panel />
      </div>

      <StickyActionBar>
        <StickyActionBar.Left>
          <span className="flex items-center gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1 w-5 rounded-[2px] ${
                  i < filledSegments ? "bg-accent" : "bg-line"
                }`}
              />
            ))}
          </span>
          <span className="text-[13px] font-semibold leading-4 text-ink">
            Step {current + 1} of {STEPS.length}
          </span>
          <span className="text-[13px] leading-4 text-muted">
            — {step.title}
          </span>
        </StickyActionBar.Left>
        <StickyActionBar.Right>
          <Button
            variant="outline"
            disabled={current === 0}
            onClick={() => goToStep(current - 1)}
          >
            <ArrowLeft />
            Back
          </Button>
          <Button onClick={isLast ? handleCreate : advance}>
            {isLast
              ? "Create organization"
              : `Continue to ${STEPS[current + 1].short}`}
            <ArrowRight />
          </Button>
        </StickyActionBar.Right>
      </StickyActionBar>

      <Dialog
        open={blocker.state === "blocked"}
        onOpenChange={(open) => {
          if (!open) blocker.reset();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave without saving?</DialogTitle>
            <DialogDescription>All changes will be lost.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                clearDraft();
                blocker.proceed();
              }}
            >
              Cancel & navigate away
            </Button>
            <Button onClick={() => blocker.reset()}>Continue filling the form</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}