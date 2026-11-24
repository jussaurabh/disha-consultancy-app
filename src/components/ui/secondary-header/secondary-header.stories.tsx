import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { SecondaryHeader } from "./secondary-header"
import { MemoryRouter } from "react-router-dom"
import { UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"

const meta = {
  component: SecondaryHeader,
  title: "Layout/SecondaryHeader",
  tags: ["autodocs"],
} satisfies Meta<typeof SecondaryHeader>
export default meta
type Story = StoryObj<typeof meta>

function withMemoryRouter(
  render: () => React.ReactElement,
) {
  return {
    render: () => (
      <MemoryRouter initialEntries={["/organizations/new"]}>
        {render()}
      </MemoryRouter>
    ),
  }
}

export const BreadcrumbBar: Story = {
  ...withMemoryRouter(() => (
    <SecondaryHeader>
      <SecondaryHeader.Back />
      <SecondaryHeader.Breadcrumb
        segments={[
          { label: "Organizations", url: "/organizations" },
          { label: "New organization" },
        ]}
      />
      <SecondaryHeader.Actions>
        <SecondaryHeader.Pill text="DRAFT · NOT SAVED" />
      </SecondaryHeader.Actions>
    </SecondaryHeader>
  )),
}

export const ContextStrip: Story = {
  ...withMemoryRouter(() => (
    <SecondaryHeader className="py-5">
      <SecondaryHeader.Back label="Employees" />
      <SecondaryHeader.Divider />
      <SecondaryHeader.Title
        avatar="MN"
        name="Meera Nair"
        badge={{ text: "Active", tone: "accent" }}
      />
      <SecondaryHeader.Actions>
        <Button variant="outline" size="icon" aria-label="Employee actions">
          <UserRound className="size-4" />
        </Button>
        <Button>Edit employee</Button>
      </SecondaryHeader.Actions>
    </SecondaryHeader>
  )),
}

export const PillTones: Story = {
  ...withMemoryRouter(() => (
    <SecondaryHeader>
      <SecondaryHeader.Back />
      <SecondaryHeader.Breadcrumb
        segments={[
          { label: "Organizations", url: "/organizations" },
          { label: "New organization" },
        ]}
      />
      <SecondaryHeader.Actions>
        <SecondaryHeader.Pill text="DRAFT · NOT SAVED" tone="copper" />
      </SecondaryHeader.Actions>
    </SecondaryHeader>
  )),
}

export const NoPill: Story = {
  ...withMemoryRouter(() => (
    <SecondaryHeader>
      <SecondaryHeader.Back />
      <SecondaryHeader.Breadcrumb
        segments={[
          { label: "Organizations", url: "/organizations" },
          { label: "New organization" },
        ]}
      />
      <SecondaryHeader.Actions />
    </SecondaryHeader>
  )),
}

export const SingleSegment: Story = {
  ...withMemoryRouter(() => (
    <SecondaryHeader>
      <SecondaryHeader.Back />
      <SecondaryHeader.Breadcrumb
        segments={[
          { label: "Organizations", url: "/organizations" },
        ]}
      />
      <SecondaryHeader.Actions>
        <SecondaryHeader.Pill text="DRAFT · NOT SAVED" />
      </SecondaryHeader.Actions>
    </SecondaryHeader>
  )),
}

export const UnlinkedSegment: Story = {
  ...withMemoryRouter(() => (
    <SecondaryHeader>
      <SecondaryHeader.Back />
      <SecondaryHeader.Breadcrumb
        segments={[
          { label: "Home" },
          { label: "Organizations", url: "/organizations" },
          { label: "New" },
        ]}
      />
      <SecondaryHeader.Actions>
        <SecondaryHeader.Pill text="DRAFT · NOT SAVED" />
      </SecondaryHeader.Actions>
    </SecondaryHeader>
  )),
}