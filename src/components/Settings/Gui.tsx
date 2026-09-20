import {
	Eraser,
	FileDown,
	FileUp,
	LayoutList,
	Lock,
	LockOpen,
} from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { useLock } from "@/contexts/LockContext";
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
import { buttonVariants } from "../ui/buttonVariants";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function Toolbar({
	editingSections,
	toggleEditingSections,
}: {
	editingSections: boolean;
	toggleEditingSections: () => void;
}) {
	const { handleImport, handleExport } = useGuitarTab();
	const { position } = useCurrentTab();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { locked, toggleLock, showText } = useLock();

	const LockedTooltip = () => (
		<span
			role="status"
			className={`absolute top-10 left-0 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background shadow-md transition-opacity duration-200 ${
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
		<div className="relative flex flex-1 items-center gap-1">
			<Input
				ref={fileInputRef}
				type="file"
				accept="application/json"
				className="hidden"
				onChange={handleFileChange}
			></Input>
			<LockedTooltip />
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant={locked ? "default" : "outline"}
						size="xs"
						onClick={toggleLock}
						className={showText ? "[&_svg]:animate-wiggle-once" : ""}
						aria-label={locked ? "Unlock editing" : "Lock editing"}
					>
						{locked ? <Lock /> : <LockOpen />}
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">
					{locked ? "Editing locked" : "Lock editing"}
				</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon-xs"
						onClick={() => fileInputRef.current?.click()}
						aria-label="Import tab from a JSON file"
					>
						<FileUp />
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">Import JSON</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon-xs"
						onClick={() => handleExport(position || "0")}
						aria-label="Export tab as JSON"
					>
						<FileDown />
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">Export JSON</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon-xs"
						onClick={() => setIsDialogOpen(true)}
						aria-label="Clear all notes in this tab"
					>
						<Eraser />
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">Clear notes</TooltipContent>
			</Tooltip>
			<div className="flex-1" />
			<Button
				onClick={() => toggleEditingSections()}
				aria-pressed={editingSections}
			>
				<LayoutList />
				<span>{editingSections ? "Editing sections" : "Edit sections"}</span>
			</Button>
			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Clear this tab?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. Every note will be reset to empty.
							This cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							className={buttonVariants({ variant: "destructive" })}
							onClick={async () => {
								await clearTab(position);
							}}
						>
							Clear tab
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
