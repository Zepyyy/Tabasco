import {
	ArrowRightCircle,
	Eraser,
	FolderInput,
	Lock,
	LockOpen,
	Moon,
	Share,
	Sun,
} from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { useNavigate } from "react-router";
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
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { Separator } from "./ui/separator";

export default function Gui() {
	const { handleImport, handleExport } = useGuitarTab();
	const { position } = useCurrentTab();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();
	const { locked, toggleLock, showText } = useLock();
	const navigate = useNavigate();

	const LockedTooltip = () => (
		<span
			className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground/70 px-2 py-1 text-xs font-semibold text-background shadow-sm transition-opacity duration-200 font-Bricolage ${
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
		<>
			<Input
				ref={fileInputRef}
				type="file"
				accept="application/json"
				className="hidden"
				onChange={handleFileChange}
			></Input>
			<div className="flex flex-row gap-6 fixed right-5 top-1/2 -translate-y-1/2 z-40">
				<div className="flex flex-col gap-5">
					<div className="relative w-fit group/tooltip">
						<LockedTooltip />
						<Button
							onClick={toggleLock}
							size="lifted"
							tooltip={locked ? "Unlock editing" : "Lock editing"}
							lifted
							className={`${locked ? "bg-primary! text-primary-foreground!" : ""} ${showText ? "[&_svg]:animate-wiggle-once" : ""}`}
							aria-label={locked ? "Unlock editing" : "Lock editing"}
						>
							{locked ? <Lock /> : <LockOpen />}
						</Button>
					</div>
					<Separator
						orientation="horizontal"
						className="border-t border-primary"
					/>
					<div className="flex flex-col gap-3">
						<Button
							lifted
							tooltip="Import"
							size="lifted"
							onClick={() => fileInputRef.current?.click()}
							aria-label="Import tab"
						>
							<FolderInput />
						</Button>

						<Button
							lifted
							tooltip="Export"
							size="lifted"
							onClick={() => handleExport(position || "0")}
							aria-label="Export tab"
						>
							<Share />
						</Button>
						<Button
							lifted
							tooltip="Clear tab"
							size="lifted"
							onClick={() => setIsDialogOpen(true)}
							aria-label="Clear tab"
						>
							<Eraser />
						</Button>
					</div>
					<Separator
						orientation="horizontal"
						className="border-t border-primary"
					/>
					<div className="flex flex-col gap-3">
						<Button
							lifted
							tooltip="Toggle theme"
							size="lifted"
							onClick={() => toggleTheme()}
							aria-label="Toggle theme"
						>
							{theme === "light" ? <Moon /> : <Sun />}
						</Button>
						<Button
							lifted
							tooltip="-> Design system"
							size="lifted"
							onClick={() => navigate("/design-system")}
							aria-label="design system"
						>
							<ArrowRightCircle />
						</Button>
					</div>
				</div>
			</div>

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
		</>
	);
}
