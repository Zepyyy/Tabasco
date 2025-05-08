import { Settings, Sun, Moon, Eraser } from "lucide-react";

import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useContext, useEffect } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useMantineColorScheme } from "@mantine/core";
import { useParams } from "react-router";
import { clearTab } from "@/db/crud/ClearTab";
import { useNavigate } from "react-router";

// Reusable component for the rename input
export default function GUIDropdownMenu() {
	const { theme, setTheme } = useContext(ThemeContext);
	const { setColorScheme } = useMantineColorScheme();
	const { tabId } = useParams<{ tabId: string }>();
	const navigate = useNavigate();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		setColorScheme(theme === "dark" ? "dark" : "light"); // Update Mantine's color scheme
	}, [theme, setColorScheme]);

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
				<DropdownMenuContent className="flex flex-col p-0 m-0 bg-background/80 rounded-lg shadow-lg ml-10 z-40 font-serifText text-xl">
					<DropdownMenuItem
						className="[&_svg]:size-6 cursor-pointer bg-background text-destructive focus:bg-foreground/10 focus:text-destructive outline-hidden text-xl"
						onClick={async () => {
							await clearTab(tabId);
							// Force a re-render by navigating to the same route
							navigate(`/sheet/${tabId}`);
						}}
					>
						<div className="flex flex-row items-center w-full gap-2">
							<Eraser />
							<span>Clear tab</span>
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="[&_svg]:size-6 cursor-pointer bg-background text-tab focus:bg-foreground/10 focus:text-tab outline-hidden text-xl"
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
					>
						<div className="flex flex-row items-center w-full gap-2">
							{theme === "light" ? <Moon /> : <Sun />}
							<span>Toggle theme</span>
						</div>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
