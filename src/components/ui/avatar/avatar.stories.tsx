import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
} from "./avatar";
import { Check, X, Camera, Plus, Bell } from "lucide-react";

/**
 * Avatar component stories
 *
 * A flexible avatar component built on Radix UI primitives.
 * Supports images, fallbacks, badges, groups, and multiple sizes.
 * Sizes: default (32px), sm (24px), lg (40px)
 */
const meta = {
  title: "UI/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A versatile avatar component with support for images, fallbacks, status badges, groups, and multiple sizes. Built on Radix UI primitives. Sizes: default (32px), sm (24px), lg (40px). Badge sizes scale with avatar size.",
      },
    },
  },
  argTypes: {
    // Root props
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
      description: "Avatar size: default (32px), sm (24px), lg (40px)",
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default avatar with fallback */
export const Default: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

/** Avatar with image */
export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        alt="John Doe"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

/** Avatar with fallback only (no image) */
export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>AS</AvatarFallback>
    </Avatar>
  ),
};

/** All sizes */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  ),
};

/** Avatar with status badge (online) */
export const WithOnlineBadge: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        alt="John Doe"
      />
      <AvatarFallback>JD</AvatarFallback>
      <AvatarBadge className="bg-green-500">
        <span className="sr-only">Online</span>
      </AvatarBadge>
    </Avatar>
  ),
};

/** Avatar with custom badge */
export const WithCustomBadge: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
          alt="Alice Smith"
        />
        <AvatarFallback>AS</AvatarFallback>
        <AvatarBadge className="bg-green-500">
          <Check className="h-2.5 w-2.5" />
        </AvatarBadge>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
          alt="Bob Johnson"
        />
        <AvatarFallback>BJ</AvatarFallback>
        <AvatarBadge className="bg-red-500">
          <X className="h-2.5 w-2.5" />
        </AvatarBadge>
      </Avatar>
      <Avatar>
        <AvatarFallback>CS</AvatarFallback>
        <AvatarBadge className="bg-yellow-500">
          <Bell className="h-2.5 w-2.5" />
        </AvatarBadge>
      </Avatar>
    </div>
  ),
};

/** Avatar with badge variants */
export const BadgeVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar>
        <AvatarFallback>ON</AvatarFallback>
        <AvatarBadge className="bg-green-500" title="Online">
          <span className="sr-only">Online</span>
        </AvatarBadge>
      </Avatar>
      <Avatar>
        <AvatarFallback>OF</AvatarFallback>
        <AvatarBadge className="bg-gray-400" title="Offline">
          <span className="sr-only">Offline</span>
        </AvatarBadge>
      </Avatar>
      <Avatar>
        <AvatarFallback>BS</AvatarFallback>
        <AvatarBadge className="bg-yellow-500" title="Busy">
          <span className="sr-only">Busy</span>
        </AvatarBadge>
      </Avatar>
      <Avatar>
        <AvatarFallback>DND</AvatarFallback>
        <AvatarBadge className="bg-red-500" title="Do Not Disturb">
          <span className="sr-only">Do Not Disturb</span>
        </AvatarBadge>
      </Avatar>
      <Avatar>
        <AvatarFallback>NEW</AvatarFallback>
        <AvatarBadge className="bg-blue-500" title="New">
          <Plus className="h-2.5 w-2.5" />
        </AvatarBadge>
      </Avatar>
    </div>
  ),
};

/** Avatar group */
export const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
          alt="John Doe"
        />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
          alt="Alice Smith"
        />
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
          alt="Bob Johnson"
        />
        <AvatarFallback>BJ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Carol"
          alt="Carol Williams"
        />
        <AvatarFallback>CW</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>+5</AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};

/** Avatar group with count */
export const GroupWithCount: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
          alt="John Doe"
        />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
          alt="Alice Smith"
        />
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
          alt="Bob Johnson"
        />
        <AvatarFallback>BJ</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+12</AvatarGroupCount>
    </AvatarGroup>
  ),
};

/** Avatar group with different sizes */
export const GroupSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-20">Small:</span>
        <AvatarGroup>
          <Avatar size="sm">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="John Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
              alt="Alice Smith"
            />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <Avatar size="sm">
            <AvatarFallback>+3</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-20">Default:</span>
        <AvatarGroup>
          <Avatar size="default">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="John Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar size="default">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
              alt="Alice Smith"
            />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <Avatar size="default">
            <AvatarFallback>+3</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-20">Large:</span>
        <AvatarGroup>
          <Avatar size="lg">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="John Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
              alt="Alice Smith"
            />
            <AvatarFallback>AS</AvatarFallback>
          </Avatar>
          <Avatar size="lg">
            <AvatarFallback>+3</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
    </div>
  ),
};

/** Avatar with camera/edit badge */
export const WithEditBadge: Story = {
  render: () => (
    <Avatar>
      <AvatarImage
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        alt="John Doe"
      />
      <AvatarFallback>JD</AvatarFallback>
      <AvatarBadge className="bg-primary bottom-0 right-0" title="Edit avatar">
        <Camera className="h-3 w-3" />
      </AvatarBadge>
    </Avatar>
  ),
};

/** User menu avatar (typical dropdown trigger) */
export const UserMenuTrigger: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarImage
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        alt="John Doe"
      />
      <AvatarFallback>JD</AvatarFallback>
      <AvatarBadge className="bg-green-500">
        <span className="sr-only">Online</span>
      </AvatarBadge>
    </Avatar>
  ),
};

/** Team members with roles */
export const TeamMembers: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      {[
        { name: "John Doe", email: "john@example.com", role: "Admin", status: "online", seed: "John" },
        { name: "Alice Smith", email: "alice@example.com", role: "Editor", status: "away", seed: "Alice" },
        { name: "Bob Johnson", email: "bob@example.com", role: "Viewer", status: "offline", seed: "Bob" },
        { name: "Carol Williams", email: "carol@example.com", role: "Admin", status: "busy", seed: "Carol" },
      ].map((member) => (
        <div key={member.name} className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.seed}`}
              alt={member.name}
            />
            <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            <AvatarBadge
              className={
                member.status === "online"
                  ? "bg-green-500"
                  : member.status === "away"
                  ? "bg-yellow-500"
                  : member.status === "busy"
                  ? "bg-red-500"
                  : "bg-gray-400"
              }
            >
              <span className="sr-only">{member.status}</span>
            </AvatarBadge>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{member.name}</p>
            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {member.role}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** Dark theme variant */
export const Dark: Story = {
  render: () => (
    <div className="dark space-y-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
            alt="John Doe"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
            alt="Bob Johnson"
          />
          <AvatarFallback>BJ</AvatarFallback>
          <AvatarBadge className="bg-green-500">
            <span className="sr-only">Online</span>
          </AvatarBadge>
        </Avatar>
      </div>
      <AvatarGroup>
        <Avatar>
          <AvatarImage
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
            alt="John Doe"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
            alt="Alice Smith"
          />
          <AvatarFallback>AS</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>+5</AvatarFallback>
        </Avatar>
      </AvatarGroup>
      <div className="flex items-center gap-4">
        <Avatar size="sm">
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
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
    <Avatar {...args}>
      <AvatarImage
        src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
        alt="John Doe"
      />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
  args: {
    size: "default",
  },
};