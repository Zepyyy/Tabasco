import { ChangeEvent, useState, useEffect, useRef } from "react";
import {
	Settings,
	Sun,
	Moon,
	Eraser,
	FolderOutput,
	FolderInput,
} from "lucide-react";

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
import { useGuitarTab } from "@/hooks/useGuitarTab";
import { Input } from "./ui/input";

export default function SettingsDropdownMenu() {
	const { theme, setTheme } = useTheme();
	const { tabPositionFromParam } = useParams<{
		tabPositionFromParam: string;
	}>();
	const navigate = useNavigate();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [displayError, setDisplayError] = useState<Error | null>(null);
	const { handleImport, handleExport, error, isLoading } = useGuitarTab();
	const errorTimerRef = useRef<number | null>(null);

	// Function to set error with auto-dismiss
	const showError = (err: Error) => {
		setDisplayError(err);

		// Clear any existing timer
		if (errorTimerRef.current) {
			window.clearTimeout(errorTimerRef.current);
		}

		// Set new timer to clear error after 10 seconds
		errorTimerRef.current = window.setTimeout(() => {
			setDisplayError(null);
		}, 10000);
	};

	// Effect to watch for errors from the hook
	useEffect(() => {
		if (error) {
			showError(error);
		}

		// Cleanup function to clear timer when component unmounts
		return () => {
			if (errorTimerRef.current) {
				window.clearTimeout(errorTimerRef.current);
			}
		};
	}, [error]);

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];

			try {
				const text = await selectedFile.text();
				const jsonData = JSON.parse(text);

				// Import the data
				await handleImport(jsonData);
			} catch (parseError) {
				console.error("Error parsing file:", parseError);
				showError(
					parseError instanceof Error
						? parseError
						: new Error(`Failed to parse file: Invalid format`),
				);
			}
		}
	};
	const fileInputRef = useRef<HTMLInputElement>(null);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant={"soft"}
						size={"bigIcon"}
						className="text-xl font-medium p-2 [&_svg]:size-10"
					>
						<Settings />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="flex flex-col p-0 mr-2 bg-background/80 rounded-lg shadow-lg z-40 font-serif-text text-xl w-52">
					<DropdownMenuItem
						className="[&_svg]:size-6 cursor-pointer bg-background text-tab focus:bg-foreground/10 focus:text-tab outline-none text-xl"
						onClick={() => setTheme(theme === "light" ? "dark" : "light")}
					>
						<div className="flex flex-row items-center w-full gap-2">
							{theme === "light" ? <Moon /> : <Sun />}
							<span>Toggle theme</span>
						</div>
					</DropdownMenuItem>

					<DropdownMenuItem
						asChild
						className="[&_svg]:size-6 cursor-pointer bg-background text-tab focus:bg-foreground/10 focus:text-tab outline-none text-xl"
					>
						<Button
							variant="transparent"
							onClick={() => {
								fileInputRef.current?.click();
							}}
							className="flex justify-start font-normal h-auto"
						>
							<div className="flex flex-row items-center gap-2 text-xl">
								<FolderInput />
								<span>Import</span>
							</div>
						</Button>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="[&_svg]:size-6 cursor-pointer bg-background text-tab focus:bg-foreground/10 focus:text-tab outline-none text-xl"
						onClick={() => handleExport(tabPositionFromParam || "0")}
					>
						<div className="flex flex-row items-center w-full gap-2">
							<FolderOutput />
							<span>Export</span>
						</div>
					</DropdownMenuItem>
					<DropdownMenuItem
						className="[&_svg]:size-6 cursor-pointer bg-background text-destructive-foreground focus:bg-destructive focus:text-destructive-foreground outline-none text-xl"
						onClick={() => setIsDialogOpen(true)}
					>
						<div className="flex flex-row items-center w-full gap-2">
							<Eraser />
							<span>Clear tab</span>
						</div>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Input
				ref={fileInputRef}
				type="file"
				accept="application/json"
				className="hidden"
				onChange={handleFileChange}
			></Input>

			{/* AlertDialog controlled by state */}
			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently clear the tab.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={async () => {
								await clearTab(tabPositionFromParam);
								// Force a re-render by navigating to the same route
								navigate(`/sheet/${tabPositionFromParam}`);
							}}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Error display */}
			{displayError && (
				<div className="fixed bottom-4 right-4 bg-destructive p-3 rounded-md shadow-lg z-50">
					<p className="font-medium text-sm text-destructive-foreground">
						Error:
						<span className="text-foreground"> {displayError.message}</span>
					</p>
					<Button
						variant="transparent"
						size="sm"
						className="block mt-2 shadow-none cursor-pointer"
						onClick={() => setDisplayError(null)}
					>
						Dismiss
					</Button>
				</div>
			)}

			{/* Loading indicator */}
			{isLoading && (
				<div className="fixed inset-0 bg-background/50 flex items-center justify-center z-50">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tab"></div>
				</div>
			)}
		</>
	);
}
