import type { Meta, StoryObj } from "@storybook/react-vite"
import { Header } from "./header"

const meta = {
  component: Header,
  title: "Layout/Header",
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
        <Header.NavItem href="#" isActive label="Dashboard" />
        <Header.NavItem href="#" label="Organizations" badge={12} />
        <Header.NavItem href="#" label="Users" />
        <Header.NavItem href="#" label="Roles" />
        <Header.NavItem href="#" label="Permissions" />
      </Header.Nav>
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