import { Moon, Sun } from "lucide-react";
import { NavLink } from "react-router";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useTabs } from "@/hooks/useTabs";
import { Button } from "../ui/button";

export function AppSidebar() {
	const { tabs } = useTabs();
	const { theme, toggleTheme } = useTheme();

	return (
		<Sidebar>
			<SidebarHeader>
				<span>Your tabs</span>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						{tabs.map((tab) => (
							<SidebarMenuItem key={tab.id}>
								<SidebarMenuButton asChild>
									<NavLink to={`/sheet/${tab.position}`}>{tab.tabName}</NavLink>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
				<SidebarGroup> </SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<Button
					variant="ghost"
					size="lg"
					onClick={() => toggleTheme()}
					className="justify-start items-center gap-4"
				>
					{theme === "dark" ? <Moon /> : <Sun />}
					<span>Toggle Theme</span>
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
