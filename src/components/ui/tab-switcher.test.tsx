/// <reference types="@testing-library/jest-dom" />

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { cleanup } from "@testing-library/react"
import { TabSwitcher } from "./tab-switcher"

const items = [
  { value: "orgs", label: "All organizations", count: 24 },
  { value: "employees", label: "Employees", count: "1,208" },
]

afterEach(() => {
  cleanup()
})

describe("TabSwitcher", () => {
  it("renders any number of tabs", () => {
    const { container } = render(
      <TabSwitcher
        defaultValue="orgs"
        items={[...items, { value: "settings", label: "Settings" }, { value: "roles", label: "Roles" }, { value: "audit", label: "Audit log" }]}
      />,
    )
    expect(container.querySelectorAll('[role="tab"]')).toHaveLength(5)
  })

  it("marks the active tab and fires onValueChange on click", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    const { container } = render(<TabSwitcher defaultValue="employees" items={items} onValueChange={onValueChange} />)
    const activeTab = container.querySelector('[role="tab"][aria-selected="true"]')
    expect(activeTab).toHaveAttribute("data-state", "active")
    expect(activeTab).toHaveAttribute("aria-selected", "true")
    await user.click(screen.getByRole("tab", { name: /organizations/i }))
    expect(onValueChange).toHaveBeenCalledWith("orgs")
  })

  it("moves the active underline when controlled", () => {
    const { container, rerender } = render(<TabSwitcher value="employees" items={items} />)
    const activeTab = container.querySelector('[role="tab"][aria-selected="true"]')
    expect(activeTab).toHaveAttribute("data-state", "active")
    rerender(<TabSwitcher value="orgs" items={items} />)
    const newActiveTab = container.querySelector('[role="tab"][aria-selected="true"]')
    expect(newActiveTab).toHaveAttribute("data-state", "active")
    const inactiveTab = container.querySelector('[role="tab"][aria-selected="false"]')
    expect(inactiveTab).toHaveAttribute("data-state", "inactive")
  })

  it("renders a count badge only when count is provided", () => {
    const { container } = render(<TabSwitcher defaultValue="orgs" items={[...items, { value: "settings", label: "Settings" }]} />)
    expect(container.querySelector('[data-slot="tab-switcher-badge"]')).toBeInTheDocument()
    // Check that settings tab has no badge
    const settingsTabElement = Array.from(container.querySelectorAll('[role="tab"]')).find(
      (el) => el.textContent?.includes("Settings")
    )
    expect(settingsTabElement?.querySelector('[data-slot="tab-switcher-badge"]')).toBeNull()
  })

  it("renders an empty list without crashing", () => {
    const { container } = render(<TabSwitcher items={[]} />)
    expect(container.querySelector('[role="tablist"]')).toBeInTheDocument()
    expect(container.querySelectorAll('[role="tab"]')).toHaveLength(0)
  })
})