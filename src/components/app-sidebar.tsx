import * as React from "react"
import {
  Plus
} from "lucide-react"
import { NavMain } from "./nav-menu"
import { DatePicker } from "@/components/date-picker"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Incomes",
      url: "#",
      icon: "CircleDollarSign",
      isActive: true,
      items: [
        {
          title: "All Incomes",
          url: "#",
        },
        {
          title: "Add an Income",
          url: "#",
        },
      ],
    },
    {
      title: "Expenses",
      url: "#",
      icon: "CirclePercent",
      items: [
        {
          title: "All Expenses",
          url: "#",
        },
        {
          title: "Add an Expense",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: "Settings2",
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
