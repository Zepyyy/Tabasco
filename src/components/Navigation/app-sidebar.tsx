import { Ellipsis, Moon, Plus, Sun, Trash2 } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTheme } from "@/contexts/ThemeContext";
import { useTabCreation } from "@/hooks/useTabCreation";
import { useTabOperations } from "@/hooks/useTabOperations";
import { useTabs } from "@/hooks/useTabs";
import type { TabInfo } from "@/types/guitar-tab";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { buttonVariants } from "../ui/buttonVariants";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

/* A tiny tab staff: six string lines with one note placed on the second. */
const TabMark = () => (
	<svg
		viewBox="0 0 24 24"
		className="size-6 shrink-0 text-foreground"
		fill="none"
		aria-hidden="true"
	>
		{[3.5, 7.5, 11.5, 15.5, 19.5].map((y) => (
			<line
				key={y}
				x1="2"
				y1={y}
				x2="22"
				y2={y}
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				opacity="0.35"
			/>
		))}
		<circle cx="15.5" cy="7.5" r="2.1" fill="var(--primary)" />
	</svg>
);

export function AppSidebar() {
	const { tabs } = useTabs();
	const { handleAddTab } = useTabCreation();
	const { handleDelete } = useTabOperations(tabs);
	const { theme, toggleTheme } = useTheme();
	const { pathname } = useLocation();
	const [tabToDelete, setTabToDelete] = useState<TabInfo | null>(null);

	const activePosition = pathname.startsWith("/sheet/")
		? pathname.slice("/sheet/".length)
		: null;

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2.5 px-2 py-1">
					<TabMark />
					<span className="text-[15px] font-medium">Tabasco</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel className="justify-between">
						Your tabs
						{tabs.length > 0 && (
							<span className="font-tab tabular-nums text-sidebar-foreground/50">
								{tabs.length}
							</span>
						)}
					</SidebarGroupLabel>
					<SidebarMenu>
						{tabs.map((tab, index) => (
							<SidebarMenuItem key={tab.id}>
								<SidebarMenuButton
									asChild
									isActive={tab.position === activePosition}
									tooltip={tab.tabName}
									className="data-[active=true]:border data-[active=true]:border-border/70 data-[active=true]:bg-popover data-[active=true]:shadow-xs"
								>
									<NavLink to={`/sheet/${tab.position}`}>
										<span className="font-tab shrink-0 text-center text-[10px] leading-none tabular-nums text-muted-foreground/70">
											{String(index + 1).padStart(2, "0")}
										</span>
										<span className="truncate">{tab.tabName}</span>
									</NavLink>
								</SidebarMenuButton>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuAction showOnHover>
											<Ellipsis />
											<span className="sr-only">Tab options</span>
										</SidebarMenuAction>
									</DropdownMenuTrigger>
									<DropdownMenuContent side="right" align="start">
										<DropdownMenuItem
											className="text-danger focus:bg-danger/10 focus:text-danger"
											onSelect={() => setTabToDelete(tab)}
										>
											<Trash2 />
											Delete tab
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
					{tabs.length === 0 && (
						<p className="px-2 py-4 text-sm text-muted-foreground">
							No tabs yet. Create your first one below.
						</p>
					)}
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="pb-4">
				<div className="flex items-center gap-2">
					<Button
						variant="default"
						className="flex-1"
						onClick={() => handleAddTab()}
					>
						<Plus />
						<span>New tab</span>
					</Button>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								onClick={() => toggleTheme()}
								aria-label={
									theme === "dark"
										? "Switch to light theme"
										: "Switch to dark theme"
								}
							>
								{theme === "dark" ? <Sun /> : <Moon />}
							</Button>
						</TooltipTrigger>
						<TooltipContent side="top">
							{theme === "dark" ? "Light theme" : "Dark theme"}
						</TooltipContent>
					</Tooltip>
				</div>
			</SidebarFooter>
			<AlertDialog
				open={tabToDelete !== null}
				onOpenChange={(open) => {
					if (!open) setTabToDelete(null);
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Delete “{tabToDelete?.tabName}”?
						</AlertDialogTitle>
						<AlertDialogDescription>
							The tab and everything written in it will be permanently removed.
							This cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className={buttonVariants({ variant: "destructive" })}
							onClick={() => {
								if (tabToDelete) {
									handleDelete(tabToDelete.id, tabToDelete.position);
								}
								setTabToDelete(null);
							}}
						>
							Delete tab
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Sidebar>
	);
}
