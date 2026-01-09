"use client";

import * as React from "react";
import { Home, Users, FileText, BookOpen } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "@/app/(roles-mangement)/writer/_components/nav-main";
import { NavUser } from "@/app/(roles-mangement)/writer/_components/nav-user";
import { TeamSwitcher } from "@/app/(roles-mangement)/writer/_components/team-switcher";

// Reuse types from existing components or define locally if needed
type User = {
  username: string;
  name: string;
  email: string;
  role: string;
};

const data = {
  navMain: [
    {
      title: "Platform Management",
      url: "/admin",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/admin",
        },
        {
          title: "Organizations", // Placeholder for image match
          url: "#",
        },
        {
          title: "Users",
          url: "/admin/users", // Assuming route exists or will exist
        },
        {
          title: "Roles",
          url: "#",
        },
        {
          title: "Permissions",
          url: "#",
        },
      ],
    },
    {
      title: "Content Management",
      url: "/admin/content",
      icon: FileText,
      items: [
        {
          title: "Articles",
          url: "/admin/posts", // Assuming route exists or we use the main page tabs
        },
        {
          title: "Featured Articles",
          url: "/admin/featured",
        },
        {
          title: "Magazines",
          url: "/admin/magazines",
        },
      ],
    },
    {
      title: "System Settings",
      url: "#",
      icon: Users, // Using generic icon
      items: [],
    },
    {
      title: "Billing & Subscriptions",
      url: "#",
      icon: BookOpen, // Using generic icon
      items: [],
    },
    {
      title: "Utilities",
      url: "#",
      icon: Users, // Using generic icon
      items: [],
    },
  ],
};

export function AdminSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User | null;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
