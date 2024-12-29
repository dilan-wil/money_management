import { ChevronRight, type LucideIcon, CircleDollarSign, CirclePercent, ChartPie, Settings2, Home } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
// Map string keys to icons
const iconMap: Record<string, LucideIcon> = {
  Home,
  CircleDollarSign,
  CirclePercent,
  Settings2,
  ChartPie
};

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: string; // Updated to string
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {

  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-gray-300">MENU</SidebarGroupLabel>
      <SidebarMenu className="text-gray-300">
        {items.map((item) => {
          const Icon = item.icon ? iconMap[item.icon] : null; // Dynamically resolve the icon
          return (
              <SidebarMenuItem className="text-2xl">
                  <Link href={item.url} onClick={() => setOpenMobile(false)}>
                    <SidebarMenuButton tooltip={item.title}>
                      {Icon && <Icon />} {/* Render the resolved icon if available */}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
              </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
