import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChevronRight,
  Mail,
  MoreHorizontal,
  Settings,
  Trash2,
  User,
  Bell,
  Shield,
  Key,
  Globe,
  Download,
  Edit,
  Copy,
  ExternalLink,
  Plus,
  Check,
  Undo,
  Redo,
  Scissors,
  Clipboard,
  Search,
  FolderOpen,
  Save,
  Layout,
  Terminal,
  Maximize,
  Share2,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Info,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuHeader,
  DropdownMenuFooter,
  DropdownMenuItemLeading,
  DropdownMenuItemTrailing,
} from "./dropdown-menu";
import { Button } from "../button";
import { Badge } from "../badge";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

/**
 * Dropdown Menu component stories
 *
 * A flexible dropdown menu component built on Radix UI primitives.
 * Supports nested menus, checkboxes, radio items, keyboard navigation,
 * descriptions, badges, avatars, headers, footers, and both light/dark themes.
 */
const meta = {
  title: "UI/Dropdown Menu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A versatile dropdown menu component with support for nested submenus, checkboxes, radio groups, keyboard navigation, descriptions, badges, avatars, headers, and footers. Built on Radix UI primitives for accessibility.",
      },
    },
  },
  argTypes: {
    // The DropdownMenu root component doesn't have many direct props to configure
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Basic dropdown with standard menu items */
export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          variant="destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Dropdown with label and grouped items */
export const WithLabelAndGroups: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Account Settings</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Mail className="mr-2 h-4 w-4" />
            Send Feedback
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Dropdown with descriptions and badges on items */
export const WithDescriptionsAndBadges: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuItem description="Customize your preferences" badge="New">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          description="Manage your profile information"
          badge={null}
        >
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          description="Configure notification preferences"
          badge="Beta"
        >
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem description="Require 2FA for login" badge={null}>
          <Shield className="mr-2 h-4 w-4" />
          Security
        </DropdownMenuItem>
        <DropdownMenuItem description="Manage API keys and tokens" badge="Pro">
          <Key className="mr-2 h-4 w-4" />
          API Keys
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          description="This action cannot be undone"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Dropdown with avatars using DropdownMenuItemLeading */
export const WithAvatars: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Team Members</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72">
        <DropdownMenuHeader>Team Members</DropdownMenuHeader>
        <DropdownMenuItem>
          <DropdownMenuItemLeading>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </DropdownMenuItemLeading>
          <div className="flex flex-col">
            <span>John Doe</span>
            <span className="text-xs text-muted-foreground">
              john@example.com
            </span>
          </div>
          <DropdownMenuItemTrailing>
            <Badge variant="secondary">Admin</Badge>
          </DropdownMenuItemTrailing>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DropdownMenuItemLeading>
            <Avatar>
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
          </DropdownMenuItemLeading>
          <div className="flex flex-col">
            <span>Alice Smith</span>
            <span className="text-xs text-muted-foreground">
              alice@example.com
            </span>
          </div>
          <DropdownMenuItemTrailing>
            <Badge variant="outline">Member</Badge>
          </DropdownMenuItemTrailing>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DropdownMenuItemLeading>
            <Avatar>
              <AvatarFallback>BJ</AvatarFallback>
            </Avatar>
          </DropdownMenuItemLeading>
          <div className="flex flex-col">
            <span>Bob Johnson</span>
            <span className="text-xs text-muted-foreground">
              bob@example.com
            </span>
          </div>
          <DropdownMenuItemTrailing>
            <Badge variant="outline">Member</Badge>
          </DropdownMenuItemTrailing>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Dropdown with header and footer */
export const WithHeaderAndFooter: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">File Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuHeader>document.pdf</DropdownMenuHeader>
        <DropdownMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <ExternalLink className="mr-2 h-4 w-4" />
          Open in New Tab
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        <DropdownMenuFooter>
          <span className="text-xs text-muted-foreground">
            Last modified 2 hours ago
          </span>
        </DropdownMenuFooter>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Dropdown with checkbox items for multi-select */
export const WithCheckboxes: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select filters</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={false}>
          Active users
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={true}>
          Verified accounts
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={false}>
          Include archived
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={false} disabled>
          Premium only (coming soon)
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Dropdown with radio group for single selection */
export const WithRadioGroup: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Sort By</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Sort options</DropdownMenuLabel>
        <DropdownMenuRadioGroup value="name">
          <DropdownMenuRadioItem value="name">Name (A-Z)</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name-desc">
            Name (Z-A)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">
            Date (Newest)
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date-desc">
            Date (Oldest)
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Dropdown with nested submenu */
export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">More Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <MoreHorizontal className="mr-2 h-4 w-4" />
            Advanced
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Email Preferences
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ChevronRight className="mr-2 h-4 w-4" />
                Deep Nesting
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Level 3 Item 1</DropdownMenuItem>
                <DropdownMenuItem>Level 3 Item 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Dropdown with keyboard shortcuts */
export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Edit Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
          <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Dropdown with different trigger types */
export const TriggerVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default">Primary Button</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">Secondary Button</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Ghost Button</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Outline Button</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

/** Comprehensive example showing all features */
export const CompleteExample: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-48">
          User Menu <MoreHorizontal className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Preferences</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={true}>
          Email notifications
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={false}>
          Push notifications
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup value="system">
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <MoreHorizontal className="mr-2 h-4 w-4" />
            Advanced Settings
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
            <DropdownMenuItem>Data Export</DropdownMenuItem>
            <DropdownMenuItem>API Access</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Dark theme variant - uses global theme decorator */
export const Dark: Story = {
  render: () => (
    <div className="p-8 rounded-lg">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open Menu (Dark)</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={true}>
            Dark mode
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={false}>
            Compact view
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  parameters: {
    globals: { theme: "dark" },
  },
};

/** Different alignments: start, center, end */
export const Alignments: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Align Start</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
          <DropdownMenuItem>Option 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Align Center</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
          <DropdownMenuItem>Option 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Align End</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Option 1</DropdownMenuItem>
          <DropdownMenuItem>Option 2</DropdownMenuItem>
          <DropdownMenuItem>Option 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

/** Different side offsets */
export const SideOffsets: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Offset 4 (default)</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={4}>
          <DropdownMenuItem>Close to trigger</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Offset 8</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={8}>
          <DropdownMenuItem>Medium distance</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Offset 16</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={16}>
          <DropdownMenuItem>Far from trigger</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

/** Context menu style (right-click) */
export const ContextMenu: Story = {
  render: () => (
    <div className="relative">
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
        Right-click anywhere in this area
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className="absolute inset-0"
            onContextMenu={(e) => e.preventDefault()}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            Copy
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Scissors className="mr-2 h-4 w-4" />
            Cut
            <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Clipboard className="mr-2 h-4 w-4" />
            Paste
            <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Info className="mr-2 h-4 w-4" />
            Get Info
            <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

/** Command palette style dropdown */
export const CommandPalette: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-72 justify-start">
          <Search className="mr-2 h-4 w-4" />
          <span>Search commands... (⌘K)</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96">
        <DropdownMenuHeader>COMMANDS</DropdownMenuHeader>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New</span>
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FolderOpen className="mr-2 h-4 w-4" />
            <span>Open File</span>
            <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Save className="mr-2 h-4 w-4" />
            <span>Save</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Save className="mr-2 h-4 w-4" />
            <span>Save All</span>
            <DropdownMenuShortcut>⌘⇧S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuHeader>EDIT</DropdownMenuHeader>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Undo className="mr-2 h-4 w-4" />
            <span>Undo</span>
            <DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Redo className="mr-2 h-4 w-4" />
            <span>Redo</span>
            <DropdownMenuShortcut>⌘⇧Z</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            <span>Copy</span>
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Scissors className="mr-2 h-4 w-4" />
            <span>Cut</span>
            <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Clipboard className="mr-2 h-4 w-4" />
            <span>Paste</span>
            <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuHeader>VIEW</DropdownMenuHeader>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Layout className="mr-2 h-4 w-4" />
            <span>Toggle Sidebar</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Terminal className="mr-2 h-4 w-4" />
            <span>Toggle Terminal</span>
            <DropdownMenuShortcut>⌘`</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Maximize className="mr-2 h-4 w-4" />
            <span>Zen Mode</span>
            <DropdownMenuShortcut>⌘K Z</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuFooter>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-muted rounded">
            ⌘K
          </kbd>{" "}
          to open command palette
        </DropdownMenuFooter>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** User avatar dropdown (common pattern) */
export const UserAvatarDropdown: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="John Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuHeader className="flex items-center gap-2 px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="John Doe"
            />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">John Doe</p>
            <p className="text-xs text-muted-foreground">john@example.com</p>
          </div>
        </DropdownMenuHeader>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Shield className="mr-2 h-4 w-4" />
          Security
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Globe className="mr-2 h-4 w-4" />
          Language
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Layout className="mr-2 h-4 w-4" />
          Appearance
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Notification dropdown with badges */
export const NotificationDropdown: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Bell className="h-5 w-5 text-foreground" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
            3
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96">
        <DropdownMenuHeader className="flex items-center justify-between px-3 py-2">
          <span className="font-medium">Notifications</span>
          <Button variant="ghost" size="icon-sm" className="h-6 w-6">
            <Check className="h-3 w-3" />
          </Button>
        </DropdownMenuHeader>
        <DropdownMenuItem className="py-3">
          <DropdownMenuItemLeading>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </DropdownMenuItemLeading>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">New message from Alice</p>
            <p className="text-xs text-muted-foreground truncate">
              Hey, did you review the PR I sent over?
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              2 minutes ago
            </p>
          </div>
          <DropdownMenuItemTrailing>
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          </DropdownMenuItemTrailing>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-3">
          <DropdownMenuItemLeading>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </DropdownMenuItemLeading>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Build succeeded</p>
            <p className="text-xs text-muted-foreground truncate">
              Your deployment to production completed successfully
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              15 minutes ago
            </p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="py-3">
          <DropdownMenuItemLeading>
            <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          </DropdownMenuItemLeading>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Review requested</p>
            <p className="text-xs text-muted-foreground truncate">
              Bob requested your review on PR #234
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              1 hour ago
            </p>
          </div>
          <DropdownMenuItemTrailing>
            <span className="h-2 w-2 rounded-full bg-orange-500" />
          </DropdownMenuItemTrailing>
        </DropdownMenuItem>
        <DropdownMenuFooter className="border-t pt-2">
          <Button variant="ghost" className="w-full text-sm">
            View all notifications
          </Button>
        </DropdownMenuFooter>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/** Interactive playground */
export const Playground: Story = {
  render: () => (
    <div className="flex min-h-64 items-center justify-center p-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Open Dropdown</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};
