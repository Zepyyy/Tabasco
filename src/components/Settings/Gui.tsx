import {
	Eraser,
	FolderInput,
	Lock,
	LockOpen,
	Moon,
	Share,
	Sun,
} from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { useLock } from "@/contexts/LockContext";
import { useTheme } from "@/contexts/ThemeContext";
import { clearTab } from "@/db/crud/ClearTab";
import { useCurrentTab } from "@/hooks/useCurrentTab";
import { useGuitarTab } from "@/hooks/useGuitarTab";
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
import { Input } from "../ui/input";

export default function Gui({
	toggleEditingSections,
}: {
	toggleEditingSections: () => void;
}) {
	const { handleImport, handleExport } = useGuitarTab();
	const { position } = useCurrentTab();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();
	const { locked, toggleLock, showText } = useLock();

	const LockedTooltip = () => (
		<span
			className={`absolute top-12 left-1/2 -translate-x-1/2 ml-8 whitespace-nowrap rounded-md bg-foreground/70 px-2 py-1 text-xs font-semibold text-background shadow-sm transition-opacity duration-200 font-Bricolage ${
				showText ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
		>
			Unlock to modify
		</span>
	);

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const selectedFile = e.target.files[0];

			try {
				const text = await selectedFile.text();
				const jsonData = JSON.parse(text);
				await handleImport(jsonData);
			} catch (parseError) {
				console.error("Error parsing file:", parseError);
			}
		}
	};

	return (
		<div className="flex gap-2">
			<Input
				ref={fileInputRef}
				type="file"
				accept="application/json"
				className="hidden"
				onChange={handleFileChange}
			></Input>
			<LockedTooltip />
			<Button
				variant="outline"
				size="xs"
				onClick={toggleLock}
				className={`${locked ? "bg-primary! text-primary-foreground! border-transparent hover:bg-primary/85!" : ""} ${showText ? "[&_svg]:animate-wiggle-once" : ""}`}
				aria-label={locked ? "Unlock editing" : "Lock editing"}
			>
				{locked ? <Lock /> : <LockOpen />}
				<span className="ml-1">Lock</span>
			</Button>
			<Button
				variant="outline"
				size="xs"
				onClick={() => fileInputRef.current?.click()}
				aria-label="Import tab"
			>
				<FolderInput className="size-3.5" />
				<span className="ml-1">Import</span>
			</Button>
			<Button
				variant="outline"
				size="xs"
				onClick={() => handleExport(position || "0")}
				aria-label="Export tab"
			>
				<Share className="size-3.5" />
				<span className="ml-1">Export</span>
			</Button>
			<Button
				variant="outline"
				size="xs"
				onClick={() => setIsDialogOpen(true)}
				aria-label="Clear tab"
			>
				<Eraser className="size-3.5" />
				<span className="ml-1">Clear</span>
			</Button>
			<Button
				variant="outline"
				size="xs"
				onClick={() => toggleTheme()}
				aria-label="Toggle theme"
			>
				{theme === "light" ? (
					<Moon aria-hidden="true" className="size-3.5" />
				) : (
					<Sun aria-hidden="true" className="size-3.5" />
				)}
				<span className="ml-1">Theme</span>
			</Button>
			<Button
				variant="default"
				size="xs"
				onClick={() => toggleEditingSections()}
				aria-label="Edit sections"
			>
				<Eraser className="size-3.5" />
				<span className="ml-1">Edit sections</span>
			</Button>
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
								await clearTab(position);
							}}
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
