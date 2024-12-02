import { ChevronRight, type LucideIcon, CircleDollarSign, CirclePercent, Settings2 } from "lucide-react";

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
  CircleDollarSign,
  CirclePercent,
  Settings2,
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
  return (
    <SidebarGroup>
      <SidebarGroupLabel>MENU</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const Icon = item.icon ? iconMap[item.icon] : null; // Dynamically resolve the icon
          return (
              <SidebarMenuItem>
                  <Link href={item.url}>
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
