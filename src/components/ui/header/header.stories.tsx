import type { Meta, StoryObj } from "@storybook/react-vite"
import { MemoryRouter } from "react-router-dom"
import { Header } from "./header"

const meta = {
  component: Header,
  title: "Layout/Header",
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Header>
export default meta
type Story = StoryObj<typeof meta>

export const BrandOnly: Story = {
  render: () => (
    <Header>
      <Header.Brand />
    </Header>
  ),
}

export const Default: Story = {
  render: () => (
    <Header>
      <Header.Brand />
      <Header.Nav>
        <Header.NavItem to="#" isActive label="Dashboard" />
        <Header.NavItem to="#" label="Organizations" badge={12} />
        <Header.NavItem to="#" label="Users" />
        <Header.NavItem to="#" label="Roles" />
        <Header.NavItem to="#" label="Permissions" />
      </Header.Nav>
      <Header.Search />
      <Header.Actions>
        <Header.Bell />
        <Header.User name="Juss Aurabh" subtitle="Consultancy" onLogout={() => {}} />
      </Header.Actions>
    </Header>
  ),
}

export const EmptyNav: Story = {
  render: () => (
    <Header>
      <Header.Brand />
      <Header.Nav />
    </Header>
  ),
}

export const WithoutSearch: Story = {
  render: () => (
    <Header>
      <Header.Brand />
      <Header.Nav>
        <Header.NavItem to="#" isActive label="Dashboard" />
        <Header.NavItem to="#" label="Users" />
      </Header.Nav>
      <Header.Actions>
        <Header.Bell />
        <Header.User name="Juss Aurabh" subtitle="Consultancy" onLogout={() => {}} />
      </Header.Actions>
    </Header>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <Header>
      <Header.Brand />
      <Header.Nav>
        <Header.NavItem to="#" isActive label="Dashboard" />
        <Header.NavItem to="#" label="Organizations" badge={12} />
      </Header.Nav>
      <Header.Search />
      <Header.Actions>
        <Header.Bell />
        <Header.User name="Juss Aurabh" subtitle="Consultancy" onLogout={() => {}} />
      </Header.Actions>
    </Header>
  ),
}