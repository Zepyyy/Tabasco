import {
	ArrowRight,
	ImportIcon,
	Lock,
	LockOpen,
	Moon,
	Share,
	Sun,
} from "lucide-react";
import { ChangeEvent, useRef } from "react";
import { useLock } from "@/contexts/LockContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrentTab } from "@/hooks/useCurrentTab";
import { useGuitarTab } from "@/hooks/useGuitarTab";
import { cn } from "@/lib/utils";
import LiftedButton from "./LiftedButton";
import { Input } from "./ui/input";

export default function Gui() {
	const { handleImport, handleExport } = useGuitarTab();

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
			}
		}
	};

	const { position } = useCurrentTab();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { theme, toggleTheme } = useTheme();
	const { locked, toggleLock, showText } = useLock();

	return (
		<div className="fixed top-5 right-10 z-40">
			<div className="flex flex-row gap-6">
				<div className="flex flex-row w-full items-center justify-center relative">
					{showText && (
						<div
							className={`relative flex items-center gap-2 whitespace-nowrap `}
						>
							<div
								className={`absolute pt-4 right-2 flex items-center gap-1 font-bold text-foreground whitespace-nowrap transition-opacity duration-200 ${showText ? "opacity-100" : "opacity-0 pointer-events-none"}`}
							>
								Unlock to modify
								<ArrowRight size={18} strokeWidth={2.5} />
							</div>
						</div>
					)}
					<LiftedButton
						className={cn(
							locked
								? "bg-primary text-primary-foreground"
								: "bg-background-light text-foreground",
							"rounded-lg",
						)}
						svg={locked ? <Lock /> : <LockOpen />}
						onClick={toggleLock}
					></LiftedButton>
				</div>
				<Input
					ref={fileInputRef}
					type="file"
					accept="application/json"
					className="hidden"
					onChange={handleFileChange}
				></Input>
				<LiftedButton
					svg={<ImportIcon />}
					onClick={() => fileInputRef.current?.click()}
				/>
				<LiftedButton
					svg={<Share />}
					onClick={() => handleExport(position || "0")}
				/>
				<LiftedButton
					svg={theme === "light" ? <Moon /> : <Sun />}
					onClick={() => toggleTheme()}
				></LiftedButton>
			</div>
		</div>
	);
}
