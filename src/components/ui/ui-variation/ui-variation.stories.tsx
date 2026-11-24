import { ArrowRight, Plus } from "lucide-react"
import { Button } from "../button"
import { UiVariation, UiVariationMeta } from "./ui-variation"

export default {
  title: "UI/UiVariation",
  component: UiVariation,
}

export const Greeting = () => (
  <div className="bg-ground pt-12">
    <UiVariation
      variant="greeting"
      title="Good morning, Arjun."
      actions={<UiVariationMeta label="Next payroll run" value="01 Dec" suffix="· 12 days" />}
    />
  </div>
)

export const Organizations = () => (
  <div className="bg-ground pt-12">
    <UiVariation
      variant="index"
      eyebrow="Client companies · 24 total"
      title="Organizations"
      actions={
        <>
          <Button variant="outline" className="h-10 rounded-md px-4 font-body text-[13px] font-semibold">
            Export
          </Button>
          <Button className="h-10 gap-2 rounded-md bg-accent px-[18px] font-body text-[13px] font-semibold text-surface hover:bg-accent/90">
            <Plus className="size-[13px]" />
            Create organization
          </Button>
        </>
      }
    />
  </div>
)

export const Employees = () => (
  <div className="bg-ground pt-12">
    <UiVariation
      variant="index"
      eyebrow="People · 1,208 across 24 organizations"
      title="Employees"
      actions={
        <>
          <Button variant="outline" className="h-10 rounded-md px-4 font-body text-[13px] font-semibold">
            Import CSV
          </Button>
          <Button className="h-10 gap-2 rounded-md bg-accent px-[18px] font-body text-[13px] font-semibold text-surface hover:bg-accent/90">
            <Plus className="size-[13px]" />
            Add employee
          </Button>
        </>
      }
    />
  </div>
)

export const CreateOrganization = () => (
  <div className="bg-ground pt-12">
    <UiVariation
      variant="form"
      eyebrow="CLIENT COMPANIES — NEW RECORD"
      title="Create organization"
      description="Register a client company, then configure payroll, statutory and banking setup."
      actions={
        <>
          <Button variant="ghost" className="h-11 rounded-md px-3 font-body text-sm font-semibold text-muted">
            Cancel
          </Button>
          <Button variant="outline" className="h-11 gap-2 rounded-md border-line bg-surface px-[22px] font-body text-sm font-semibold text-ink">
            Save draft
            <ArrowRight className="size-3.5" />
          </Button>
        </>
      }
    />
  </div>
)

export const Dark = () => (
  <div className="dark bg-ground p-8">
    <UiVariation
      variant="index"
      eyebrow="Client companies · 24 total"
      title="Organizations"
      actions={
        <>
          <Button variant="outline" className="h-10 rounded-md px-4 font-body text-[13px] font-semibold">
            Export
          </Button>
          <Button className="h-10 gap-2 rounded-md bg-accent px-[18px] font-body text-[13px] font-semibold text-surface hover:bg-accent/90">
            <Plus className="size-[13px]" />
            Create organization
          </Button>
        </>
      }
    />
  </div>
)