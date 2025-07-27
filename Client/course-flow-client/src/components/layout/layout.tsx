import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/utils/app-sidebar";
import { Outlet } from "react-router";
export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger className="sticky top-0" />
        <div className="p-4 bg-[#FDFBF9] w-full">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
