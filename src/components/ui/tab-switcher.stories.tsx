import { useState } from "react"
import { TabSwitcher } from "./tab-switcher"

export default {
  title: "UI/TabSwitcher",
  component: TabSwitcher,
}

export const Base = () => (
  <div className="bg-ground">
    <TabSwitcher
      defaultValue="employees"
      items={[
        { value: "orgs", label: "All organizations", count: 24 },
        { value: "employees", label: "Employees", count: "1,208" },
      ]}
    />
  </div>
)

export const Variant = () => (
  <div className="bg-ground">
    <TabSwitcher
      defaultValue="orgs"
      items={[
        { value: "orgs", label: "All organizations", count: 24 },
        { value: "employees", label: "Employees", count: "1,208" },
      ]}
    />
  </div>
)

export const ManyTabs = () => (
  <div className="bg-ground">
    <TabSwitcher
      defaultValue="orgs"
      items={[
        { value: "orgs", label: "Organizations", count: 24 },
        { value: "employees", label: "Employees", count: "1,208" },
        { value: "roles", label: "Roles" },
        { value: "invites", label: "Invites", count: 7 },
        { value: "audit", label: "Audit log" },
      ]}
    />
  </div>
)

export const Controlled = () => {
  const [value, setValue] = useState("orgs")
  return (
    <div className="bg-ground">
      <TabSwitcher
        value={value}
        onValueChange={setValue}
        items={[
          { value: "orgs", label: "All organizations", count: 24 },
          { value: "employees", label: "Employees", count: "1,208" },
        ]}
      />
    </div>
  )
}

export const Dark = () => (
  <div className="dark bg-ground p-8">
    <TabSwitcher
      defaultValue="employees"
      items={[
        { value: "orgs", label: "All organizations", count: 24 },
        { value: "employees", label: "Employees", count: "1,208" },
      ]}
    />
  </div>
)