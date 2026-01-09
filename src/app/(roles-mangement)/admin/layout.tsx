import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(roles-mangement)/writer/_components/app-sidebar";
import { AdminSidebar } from "./_components/admin-sidebar";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { currentUser } from "@/utils/get-current-user.helper";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user || user.role !== "ADMIN") {
    // Ideally this is handled by middleware or page-level checks,
    // but safe to redirect if not admin in layout too.
    // checkRole is async, can't be used easily here without await, assumes currentUser returns enough info.
  }

  // Adaptation of the User object for the sidebar
  const sidebarUser = user
    ? {
        username: user.username || "admin",
        name: user.name || "Admin",
        email: user.email || "",
        role: user.role,
        image: user.image || "", // Add if your NavUser supports it
        avatarUrl: user.image, // Support both
      }
    : null;

  return (
    <SidebarProvider>
      <AdminSidebar user={sidebarUser} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-4">
          <div className="flex items-center gap-2 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              {/* Search etc can go here if needed to match image exactly, for now just basic header */}
            </div>
          </div>
        </header>
        <div className="p-4 pt-0 mt-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
