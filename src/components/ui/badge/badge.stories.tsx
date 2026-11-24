import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
import { Check, X, AlertCircle, Info, Clock, TrendingUp, TrendingDown, Zap, Shield, Star, Tag, User, Eye, Lock, Mail, Bell } from "lucide-react";

/**
 * Badge component stories
 *
 * A versatile badge component built with class-variance-authority (cva).
 * Supports multiple variants, asChild for composition, and icon support.
 * Variants: default, secondary, destructive, outline, ghost, link
 */
const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A versatile badge component with 6 variants (default, secondary, destructive, outline, ghost, link) and support for asChild composition. Uses cva for variant management. Height: 20px (h-5), rounded-full, text-xs.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
      description: "Visual variant of the badge",
    },
    asChild: {
      control: "boolean",
      description: "Render as a child component (for composition with links, buttons, etc.)",
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default variant (primary) */
export const Default: Story = {
  render: () => <Badge>Default</Badge>,
};

/** All variants */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};

/** Variants with descriptions */
export const VariantsWithLabels: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-64">
      {[
        { variant: "default", label: "Default", desc: "Primary action / active state" },
        { variant: "secondary", label: "Secondary", desc: "Muted / less prominent" },
        { variant: "destructive", label: "Destructive", desc: "Error / danger / destructive" },
        { variant: "outline", label: "Outline", desc: "Subtle / bordered" },
        { variant: "ghost", label: "Ghost", desc: "Minimal / hover only" },
        { variant: "link", label: "Link", desc: "Inline link style" },
      ].map(({ variant, label, desc }) => (
        <div key={variant} className="flex items-center gap-3">
          <Badge variant={variant as any}>{label}</Badge>
          <span className="text-xs text-muted-foreground">{desc}</span>
        </div>
      ))}
    </div>
  ),
};

/** Status badges */
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default" className="gap-1">
        <Check className="h-3 w-3" />
        Active
      </Badge>
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
      <Badge variant="destructive" className="gap-1">
        <X className="h-3 w-3" />
        Inactive
      </Badge>
      <Badge variant="outline" className="gap-1">
        <AlertCircle className="h-3 w-3" />
        Warning
      </Badge>
      <Badge variant="ghost" className="gap-1">
        <Info className="h-3 w-3" />
        Info
      </Badge>
    </div>
  ),
};

/** Status with colored dots */
export const StatusWithDots: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      {[
        { label: "Online", color: "bg-green-500", variant: "default" as const },
        { label: "Away", color: "bg-yellow-500", variant: "secondary" as const },
        { label: "Busy", color: "bg-red-500", variant: "destructive" as const },
        { label: "Offline", color: "bg-gray-400", variant: "outline" as const },
      ].map(({ label, color, variant }) => (
        <Badge key={label} variant={variant} className="gap-1.5">
          <span className={`h-2 w-2 rounded-full ${color}`} />
          {label}
        </Badge>
      ))}
    </div>
  ),
};

/** Count badges */
export const CountBadges: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">5</Badge>
      <Badge variant="secondary">12</Badge>
      <Badge variant="destructive">3</Badge>
      <Badge variant="outline">0</Badge>
      <Badge variant="ghost">99+</Badge>
    </div>
  ),
};

/** Badge with icons */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default" className="gap-1">
        <Zap className="h-3 w-3" />
        Featured
      </Badge>
      <Badge variant="secondary" className="gap-1">
        <Shield className="h-3 w-3" />
        Verified
      </Badge>
      <Badge variant="outline" className="gap-1">
        <Star className="h-3 w-3" />
        Popular
      </Badge>
      <Badge variant="ghost" className="gap-1">
        <Tag className="h-3 w-3" />
        Tagged
      </Badge>
      <Badge variant="destructive" className="gap-1">
        <TrendingUp className="h-3 w-3" />
        Trending
      </Badge>
      <Badge variant="link" className="gap-1">
        <TrendingDown className="h-3 w-3" />
        Declining
      </Badge>
    </div>
  ),
};

/** asChild with anchor tag */
export const AsLink: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="link" asChild>
        <a href="#" className="inherit">Documentation</a>
      </Badge>
      <Badge variant="link" asChild>
        <a href="#" className="inherit">API Reference</a>
      </Badge>
      <Badge variant="default" asChild>
        <a href="#" className="inherit">External Link</a>
      </Badge>
    </div>
  ),
};

/** asChild with button */
export const AsButton: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default" asChild>
        <button type="button">Default</button>
      </Badge>
      <Badge variant="secondary" asChild>
        <button type="button">Secondary</button>
      </Badge>
      <Badge variant="destructive" asChild>
        <button type="button">Destructive</button>
      </Badge>
      <Badge variant="outline" asChild>
        <button type="button">Outline</button>
      </Badge>
    </div>
  ),
};

/** Notification/badge counts on UI elements */
export const NotificationBadges: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="relative">
        <button className="relative p-2 rounded-lg bg-muted hover:bg-accent">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            3
          </span>
        </button>
      </div>
      <div className="relative">
        <button className="relative p-2 rounded-lg bg-muted hover:bg-accent">
          <Mail className="h-5 w-5" />
          <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-[18px] px-1.5">
            12
          </Badge>
        </button>
      </div>
      <div className="relative">
        <button className="relative p-2 rounded-lg bg-muted hover:bg-accent">
          <Shield className="h-5 w-5" />
          <Badge variant="default" className="absolute -top-1 -right-1 h-5 min-w-[18px] px-1.5">
            1
          </Badge>
        </button>
      </div>
    </div>
  ),
};

/** Tags/labels */
export const Tags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {[
        "React",
        "TypeScript",
        "Next.js",
        "Tailwind",
        "Radix UI",
        "Storybook",
        "Testing",
        "CI/CD",
      ].map((tag) => (
        <Badge key={tag} variant="outline" className="gap-1">
          <Tag className="h-3 w-3" />
          {tag}
        </Badge>
      ))}
    </div>
  ),
};

/** Version/release badges */
export const VersionBadges: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">v1.0.0</Badge>
      <Badge variant="secondary">v0.9.0-beta</Badge>
      <Badge variant="outline">v0.8.0-alpha</Badge>
      <Badge variant="destructive">v0.7.0-deprecated</Badge>
      <Badge variant="ghost">latest</Badge>
      <Badge variant="link">canary</Badge>
    </div>
  ),
};

/** User role badges */
export const RoleBadges: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default" className="gap-1">
        <Shield className="h-3 w-3" />
        Admin
      </Badge>
      <Badge variant="secondary" className="gap-1">
        <User className="h-3 w-3" />
        Member
      </Badge>
      <Badge variant="outline" className="gap-1">
        <Eye className="h-3 w-3" />
        Viewer
      </Badge>
      <Badge variant="ghost" className="gap-1">
        <Lock className="h-3 w-3" />
        Guest
      </Badge>
    </div>
  ),
};

/** Payment/status badges */
export const PaymentBadges: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-64">
      {[
        { label: "Paid", variant: "default" as const, Icon: Check },
        { label: "Pending", variant: "secondary" as const, Icon: Clock },
        { label: "Failed", variant: "destructive" as const, Icon: X },
        { label: "Refunded", variant: "outline" as const, Icon: TrendingDown },
        { label: "Partial", variant: "ghost" as const, Icon: AlertCircle },
      ].map(({ label, variant, Icon }) => (
        <Badge key={label} variant={variant} className="gap-1.5 w-full justify-start">
          <Icon className="h-3 w-3" />
          {label}
        </Badge>
      ))}
    </div>
  ),
};

/** Dark theme variant */
export const Dark: Story = {
  render: () => (
    <div className="dark space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="link">Link</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="default" className="gap-1">
          <Check className="h-3 w-3" />
          Active
        </Badge>
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
        <Badge variant="destructive" className="gap-1">
          <X className="h-3 w-3" />
          Failed
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="default" asChild>
          <a href="#" className="inherit">Link badge</a>
        </Badge>
        <Badge variant="default" asChild>
          <button type="button">Button badge</button>
        </Badge>
      </div>
    </div>
  ),
  parameters: {
    globals: { theme: "dark" },
  },
};

/** Interactive playground */
export const Playground: Story = {
  render: (args) => (
    <Badge {...args}>
      Badge Content
    </Badge>
  ),
  args: {
    variant: "default",
    asChild: false,
  },
};

