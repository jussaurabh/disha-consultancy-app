import type { Meta, StoryObj } from "@storybook/react-vite";
import { StickyActionBar } from "./sticky-action-bar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const meta = {
  component: StickyActionBar,
  title: "Layout/StickyActionBar",
  tags: ["autodocs"],
} satisfies Meta<typeof StickyActionBar>;
export default meta;
type Story = StoryObj<typeof meta>;

function StepSegments({ current, total }: { current: number; total: number }) {
  return (
    <span className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`h-1 w-5 rounded-[2px] ${i < current ? "bg-accent" : "bg-line"}`} />
      ))}
    </span>
  );
}

export const FormStepperState: Story = {
  render: () => (
    <StickyActionBar>
      <StickyActionBar.Left>
        <StepSegments current={1} total={6} />
        <span className="text-[13px] font-semibold leading-4 text-ink">Step 1 of 6</span>
        <span className="text-[13px] leading-4 text-muted">— Company details</span>
      </StickyActionBar.Left>
      <StickyActionBar.Right>
        <Button variant="outline"><ArrowLeft className="size-4" />Back</Button>
        <Button>Continue to Contact<ArrowRight className="size-4" /></Button>
      </StickyActionBar.Right>
    </StickyActionBar>
  ),
};

export const ActionsOnly: Story = {
  render: () => (
    <StickyActionBar>
      <StickyActionBar.Right>
        <Button variant="outline">Cancel</Button>
        <Button>Save changes</Button>
      </StickyActionBar.Right>
    </StickyActionBar>
  ),
};

export const StickyInScroll: Story = {
  render: () => (
    <div className="h-72 overflow-auto rounded-lg border border-line bg-ground">
      <div className="h-[800px] px-4 py-6 text-sm text-muted">Scroll down — the bar stays docked.</div>
      <StickyActionBar>
        <StickyActionBar.Left><span className="text-sm text-muted">Form state</span></StickyActionBar.Left>
        <StickyActionBar.Right><Button>Continue</Button></StickyActionBar.Right>
      </StickyActionBar>
    </div>
  ),
};