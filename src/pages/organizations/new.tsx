import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SecondaryHeader } from "@/components/ui/secondary-header";
import { PageHeader } from "@/components/ui/page-header";
import { Stepper } from "@/components/ui/stepper";
import { InfoNote } from "@/components/ui/info-note";
import { StickyActionBar } from "@/components/ui/sticky-action-bar";
import { FormPanel } from "@/components/ui/form-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { STEPS, panelHeaderProps } from "./new-shared";
import { CompanyPanel } from "./company-panel";

function PlaceholderPanel({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  return (
    <FormPanel {...panelHeaderProps(step, index)}>
      <EmptyState
        title="Coming soon"
        subTitle={`The ${step.title} form is not implemented in this milestone.`}
        className="py-16"
      />
    </FormPanel>
  );
}

export default function NewOrganizationPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const step = STEPS[current];
  const isLast = current === STEPS.length - 1;
  const filledSegments = Math.min(current + 1, STEPS.length - 1);

  const goToStep = (index: number) =>
    setCurrent(Math.max(0, Math.min(STEPS.length - 1, index)));
  const advance = () => goToStep(current + 1);

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
          <>
            <Button variant="ghost" onClick={() => navigate("/organizations")}>
              Cancel
            </Button>
            <Button variant="outline" onClick={advance}>
              Save draft
              <ArrowRight />
            </Button>
          </>
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

        {current === 0 ? (
          <CompanyPanel />
        ) : (
          <PlaceholderPanel step={step} index={current} />
        )}
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
          <Button disabled={isLast} onClick={advance}>
            {isLast
              ? "Create organization"
              : `Continue to ${STEPS[current + 1].short}`}
            <ArrowRight />
          </Button>
        </StickyActionBar.Right>
      </StickyActionBar>
    </div>
  );
}