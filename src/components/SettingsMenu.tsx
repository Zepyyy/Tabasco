import { Eraser, FolderInput, Lock, LockOpen, Moon, Share, Sun } from "lucide-react";
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
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Gui() {
	const { handleImport, handleExport } = useGuitarTab();
	const { position } = useCurrentTab();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { theme, toggleTheme } = useTheme();
	const { locked, toggleLock } = useLock();

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
			<div className="flex flex-col">
			<div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
                <Button
                    lifted
					variant="soft"
					size="lifted"
					onClick={toggleLock}
					aria-label={locked ? "Unlock editing" : "Lock editing"}
				>
					soft {locked ? <Lock /> : <LockOpen />}
				</Button>
                <Button
                    lifted
                    variant="deep"
					size="lifted"
					onClick={() => toggleTheme()}
					aria-label="Toggle theme"
				>
					qsqsqssqqsqssqsq {theme === "light" ? <Moon /> : <Sun />}
				</Button>
                <Button
                    lifted
					variant="default"
					size="lifted"
					onClick={() => fileInputRef.current?.click()}
					aria-label="Import tab"
				>
					default <FolderInput />
                </Button>
                <Button
                    lifted
					variant="shallow"
					size="lifted"
					onClick={() => handleExport(position || "0")}
					aria-label="Export tab"
				>
					shallow <Share />
				</Button>
                <Button
                    lifted
					variant="outline"
					size="lifted"
					onClick={() => setIsDialogOpen(true)}
					aria-label="Clear tab"
				>
					Outline <Eraser />
				</Button>
			</div>
			<div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3">
                <Button
                    lifted
					variant="soft"
					size="lifted"
					onClick={toggleLock}
					aria-label={locked ? "Unlock editing" : "Lock editing"}
				>
					soft {locked ? <Lock /> : <LockOpen />}
				</Button>
                <Button
                    lifted
                    variant="deep"
					size="lifted"
					onClick={() => toggleTheme()}
					aria-label="Toggle theme"
				>
					deep {theme === "light" ? <Moon /> : <Sun />}
				</Button>
                <Button
                    lifted
					variant="default"
					size="lifted"
					onClick={() => fileInputRef.current?.click()}
					aria-label="Import tab"
				>
					default <FolderInput />
                </Button>
                <Button
                    lifted
					variant="shallow"
					size="lifted"
					onClick={() => handleExport(position || "0")}
					aria-label="Export tab"
				>
					shallow <Share />
				</Button>
                <Button
                    lifted
					variant="outline"
					size="lifted"
					onClick={() => setIsDialogOpen(true)}
					aria-label="Clear tab"
				>
					<Eraser />
				</Button>
			</div></div>

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
