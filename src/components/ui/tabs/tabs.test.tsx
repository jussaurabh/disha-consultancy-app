/// <reference types="@testing-library/jest-dom" />
import { cleanup, render } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { Tabs, TabsList, TabsTrigger } from "./tabs"

afterEach(() => cleanup())

function group(listProps?: Record<string, unknown>, triggerProps?: Record<string, unknown>) {
  return render(
    <Tabs defaultValue="employees">
      <TabsList {...listProps}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="employees" {...triggerProps}>Employees</TabsTrigger>
      </TabsList>
    </Tabs>,
  )
}

describe("Tabs", () => {
  it("default list renders the segmented track", () => {
    const { getByRole } = group()
    const list = getByRole("tablist")
    expect(list.className).toContain("bg-accent-soft")
    expect(list.className).toContain("rounded-lg")
    expect(list.className).toContain("p-1")
  })

  it("line trigger carries the 2px underline classes", () => {
    const { getByRole } = group({ variant: "line" })
    expect(getByRole("tab", { name: "Overview" }).className).toContain("border-b-2")
    expect(getByRole("tab", { name: "Employees" }).className).toContain("data-active:border-accent")
  })

  it("pill active trigger tints accent-soft with accent text", () => {
    const { getByRole } = group({ variant: "pill" })
    const cls = getByRole("tab", { name: "Employees" }).className
    expect(cls).toContain("data-active:bg-accent-soft")
    expect(cls).toContain("data-active:text-accent")
  })

  it("trigger renders the copper count badge", () => {
    const { getByRole } = group(undefined, { count: 128 })
    expect(getByRole("tab", { name: /Employees/ }).querySelector('[data-slot="tabs-count"]')).not.toBeNull()
  })

  it("vertical list renders the side-rail card", () => {
    const { getByRole } = render(
      <Tabs defaultValue="a" orientation="vertical">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
        </TabsList>
      </Tabs>,
    )
    expect(getByRole("tablist").className).toContain("group-data-vertical/tabs:w-[200px]")
  })
})
