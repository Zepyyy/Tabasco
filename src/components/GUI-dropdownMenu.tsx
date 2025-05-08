import { useState } from "react";
import { Settings, Sun, Moon, Eraser } from "lucide-react";

import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useParams, useNavigate } from "react-router";
import { clearTab } from "@/db/crud/ClearTab";
import { useTheme } from "./theme-provider";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";

export default function GUIDropdownMenu() {
	const { theme, setTheme } = useTheme();
	const { tabId } = useParams<{ tabId: string }>();
	const navigate = useNavigate();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant={"deep"}
						size={"icon-resize"}
						className="text-xl font-medium p-2 [&_svg]:size-10 aspect-square"
					>
						<Settings />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="flex flex-col p-0 m-0 bg-background/80 rounded-lg shadow-lg ml-10 z-40 font-serif-text text-xl">
					<DropdownMenuItem
						className="[&_svg]:size-6 cursor-pointer text-destructive-foreground focus:bg-destructive/10 focus:text-destructive outline-none text-xl"
						onClick={() => setIsDialogOpen(true)}
					>
						<div className="flex flex-row items-center w-full gap-2">
							<Eraser />
							<span>Clear tab</span>
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="[&_svg]:size-6 cursor-pointer bg-background text-tab focus:bg-foreground/10 focus:text-tab outline-none text-xl"
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
					>
						<div className="flex flex-row items-center w-full gap-2">
							{theme === "light" ? <Moon /> : <Sun />}
							<span>Toggle theme</span>
						</div>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			{/* AlertDialog controlled by state */}
			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () => {
								await clearTab(tabId);
								// Force a re-render by navigating to the same route
								navigate(`/sheet/${tabId}`);
							}}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
