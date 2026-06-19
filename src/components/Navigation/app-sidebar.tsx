import { Moon, Plus, Sun, Trash } from "lucide-react";
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
import { useTabCreation } from "@/hooks/useTabCreation";
import { useTabOperations } from "@/hooks/useTabOperations";
import { useTabs } from "@/hooks/useTabs";
import { Button } from "../ui/button";

export function AppSidebar() {
	const { tabs } = useTabs();
	const { handleAddTab } = useTabCreation();
	const { handleDeleteCurrentTab } = useTabOperations();
	const { theme, toggleTheme } = useTheme();

	return (
		<Sidebar>
			<SidebarHeader className="bg-sidebar">
				<span className="px-2 py-1 text-sm">Your tabs</span>
			</SidebarHeader>
			<SidebarContent className="bg-sidebar noise">
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
			</SidebarContent>
			<SidebarFooter className="bg-sidebar">
				<Button
					variant="outline-fill"
					size="lg"
					className="justify-start items-center gap-4"
					onClick={() => handleAddTab()}
				>
					<Plus />
					<span>Add tab</span>
				</Button>
				<Button
					variant="destructive"
					size="lg"
					className="justify-start items-center gap-4"
					onClick={() => handleDeleteCurrentTab()}
				>
					<Trash />
					<span>Delete this tab</span>
				</Button>
				<Button
					variant="ghost"
					size="lg"
					onClick={() => toggleTheme()}
					className="justify-start items-center gap-4 mt-6"
				>
					{theme === "dark" ? <Moon /> : <Sun />}
					<span>Toggle Theme</span>
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
