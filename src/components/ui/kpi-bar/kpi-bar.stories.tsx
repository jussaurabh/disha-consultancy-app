import { KpiBar } from "./kpi-bar"

export default {
  title: "UI/KpiBar",
  component: KpiBar,
}

export const Default = () => (
  <div className="bg-ground p-8">
    <KpiBar
      items={[
        { label: "Organizations", value: 24, delta: "+3 this month" },
        { label: "Users", value: 132, delta: "+9 this month" },
        { label: "Roles", value: 6, delta: "2 custom", tone: "muted" },
      ]}
    />
  </div>
)

export const Dark = () => (
  <div className="dark bg-background p-8">
    <KpiBar
      items={[
        { label: "Organizations", value: 24, delta: "+3 this month" },
        { label: "Users", value: 132, delta: "+9 this month" },
        { label: "Roles", value: 6, delta: "2 custom", tone: "muted" },
      ]}
    />
  </div>
)
