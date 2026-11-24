import { MemoryRouter } from "react-router-dom"

import {
  AddOrganizationIcon,
  CreateRoleIcon,
  InviteUserIcon,
  QuickActions,
} from "./quick-actions"

export default {
  title: "UI/QuickActions",
  component: QuickActions,
  // Rows are react-router links, so stories need a router context.
  decorators: [
    (Story: () => React.JSX.Element) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
}

// 1:1 with the design (dc · 01 / Dashboard · Quick actions), light register.
export const Default = () => (
  <div className="bg-ground p-8">
    <div className="w-80">
      <QuickActions
        items={[
          {
            icon: AddOrganizationIcon,
            label: "Add organization",
            description: "Onboard a client company",
            href: "/organizations",
          },
          {
            icon: InviteUserIcon,
            label: "Invite user",
            description: "Add a teammate to the workspace",
            href: "/users",
          },
          {
            icon: CreateRoleIcon,
            label: "Create role",
            description: "Define access for a new team",
            href: "/roles",
          },
        ]}
      />
    </div>
  </div>
)

// Same content in the dark register of the dc palette.
export const Dark = () => (
  <div className="dark bg-ground p-8">
    <div className="w-80">
      <QuickActions
        items={[
          {
            icon: AddOrganizationIcon,
            label: "Add organization",
            description: "Onboard a client company",
            href: "/organizations",
          },
          {
            icon: InviteUserIcon,
            label: "Invite user",
            description: "Add a teammate to the workspace",
            href: "/users",
          },
          {
            icon: CreateRoleIcon,
            label: "Create role",
            description: "Define access for a new team",
            href: "/roles",
          },
        ]}
      />
    </div>
  </div>
)

// More rows than the design board: tones cycle and the title is customizable.
export const Compact = () => (
  <div className="bg-ground p-8">
    <div className="w-80">
      <QuickActions
        title="Team shortcuts"
        items={[
          {
            icon: InviteUserIcon,
            label: "Invite user",
            description: "Add a teammate to the workspace",
            href: "/users",
          },
          {
            icon: CreateRoleIcon,
            label: "Create role",
            href: "/roles",
          },
        ]}
      />
    </div>
  </div>
)
