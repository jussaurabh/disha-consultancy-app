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