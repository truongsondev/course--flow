import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import MyImage from "@/components/pages/image-kit";
import { items } from "@/constants/menu-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-white flex flex-col justify-between">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel className="mb-6">
              <MyImage
                src="page/logo_main.jpg"
                width={30}
                height={40}
                alt="logo"
              />
              <span className="text-lg ml-2">Course Flow</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          isActive
                            ? "text-black flex gap-6"
                            : "text-black flex gap-6"
                        }
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        <SidebarFooter className="flex flex-row items-center justify-start ">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>avt</AvatarFallback>
          </Avatar>
          <SidebarMenuButton className="text-sm font-medium">
            Le Truong Son
          </SidebarMenuButton>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
