'use client'

import * as React from "react"
import {
  Plus
} from "lucide-react"
import { NavMain } from "./nav-menu"
import { DatePicker } from "@/components/date-picker"
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
import { ScrollArea, ScrollBar } from "./ui/scroll-area"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: "Home",
      isActive: true,
    },
    {
      title: "Incomes",
      url: "/dashboard/incomes",
      icon: "CircleDollarSign",
      isActive: true,
    },
    {
      title: "Expenses",
      url: "/dashboard/expenses",
      icon: "CirclePercent",
    },
    {
      title: "Financial Summary",
      url: "/dashboard/summary",
      icon: "ChartPie",
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
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
  const [sidebarOpen, setSidebarOpen] = React.useState(true); // Track the sidebar state
  const [userInfo, setUserInfo] = React.useState<{ name: string, email: string, avatar: string }>({ name: "", email: "", avatar: "" })
  React.useEffect(() => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    setUserInfo({ name: user.displayName || "Anonymous", email: user.email || "No email", avatar: user.photoURL || "No avatar" })

  }, [])
  const closeSidebar = () => setSidebarOpen(false); // Function to close sidebar

  return (
    <Sidebar {...props} >
      <SidebarHeader style={{ backgroundImage: 'url(/chalk.webp)' }} className="flex justify-center items-center h-16 border-b border-sidebar-border text-gray-400">
        <p className="text-2xl font-bold">MYMONEY</p>
      </SidebarHeader>
      <ScrollArea>
        <SidebarContent style={{ backgroundImage: 'url(/chalk.webp)', overflowX: "hidden" }} className="text-gray-300">
          <SidebarSeparator className="mx-0" />
          <NavMain items={data.navMain} />
          <DatePicker />
        </SidebarContent>
        <ScrollBar />
      </ScrollArea>
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
