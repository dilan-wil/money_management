'use client'

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
import { useAuth } from "./context/auth-context"

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
      url: "/dashboard/incomes",
      icon: "CircleDollarSign",
      isActive: true,
    },
    {
      title: "Overview",
      url: "/dashboard",
      icon: "Home",
      isActive: true,
    },
    {
      title: "Expenses",
      url: "/dashboard/expenses",
      icon: "CirclePercent",
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
  const { user } = useAuth();
  const [userInfo, setUserInfo] = React.useState<{name: string, email: string, avatar: string}>({name: "", email: "", avatar: ""})
  React.useEffect(() => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    setUserInfo({name: user.displayName || "Anonymous", email: user.email || "No email", avatar: user.photoURL || "No avatar"})
    
  }, [])
  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <NavUser user={userInfo} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <NavMain items={data.navMain} />
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
