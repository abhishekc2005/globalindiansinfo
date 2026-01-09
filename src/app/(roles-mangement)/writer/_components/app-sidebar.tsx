"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  FileText,
  GalleryVerticalEnd,
  Home,
  User,
  Settings,
  Activity,
  User2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
// Define the user type
type User = {
  username: string;
  name: string;
  email: string;
  role: string;
};

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/writer",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/writer",
        },
        {
          title: "Write a Post",
          url: "/writer/posts/create",
        },

        {
          title: "My Published Posts",
          url: "/writer/posts/published",
        },
      ],
    },
    {
      title: "Posts",
      url: "/writer/posts",
      icon: FileText,
      items: [
        {
          title: "All Posts",
          url: "/writer/posts",
        },
        {
          title: "Drafts",
          url: "/writer/posts/drafts",
        },
        {
          title: "Scheduled Posts",
          url: "/writer/posts/scheduled",
        },
        {
          title: "Featured Posts",
          url: "/writer/posts/featured",
        },
      ],
    },
    {
      title: "Content Tools",
      url: "#",
      icon: Activity,
      items: [
        {
          title: "Media Library",
          url: "/writer/media",
        },
        {
          title: "Tags",
          url: "/writer/tags",
        },
        {
          title: "Categories",
          url: "/writer/categories",
        },
        {
          title: "SEO Tools",
          url: "/writer/seo",
        },
        {
          title: "Magazines",
          url: "/writer/magazine",
        },
      ],
    },
    {
      title: "Audience",
      url: "#",
      icon: User2,
      items: [
        {
          title: "Subscribers",
          url: "/writer/audience/subscribers",
        },
        {
          title: "Comments",
          url: "/writer/comments",
        },
        {
          title: "Analytics",
          url: "/writer/analytics",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/writer/settings/profile",
        },
        {
          title: "Notifications",
          url: "/writer/settings/notifications",
        },
        {
          title: "Publishing Settings",
          url: "/writer/settings/publishing",
        },
        {
          title: "API & Integrations",
          url: "/writer/settings/integrations",
        },
      ],
    },
  ],

  // quickActions: [
  //   {
  //     name: "Book Appointment",
  //     icon: Calendar,
  //     color: "blue"
  //   },
  //   {
  //     name: "View Records",
  //     icon: FileText,
  //     color: "green"
  //   },
  //   {
  //     name: "Medications",
  //     icon: Pill,
  //     color: "purple"
  //   },
  // ],
};

export function AppSidebar({
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
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
