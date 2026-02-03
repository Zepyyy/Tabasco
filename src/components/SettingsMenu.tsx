import { ImportIcon, Moon, Share, Sun } from "lucide-react";
import { ChangeEvent, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useGuitarTab } from "@/hooks/useGuitarTab";
import LiftedButton from "./LiftedButton";
import { Input } from "./ui/input";
import { useCurrentTab } from "@/hooks/useCurrentTab";

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
				// showError(
				// 	parseError instanceof Error
				// 		? parseError
				// 		: new Error(`Failed to parse file: Invalid format`),
				// );
			}
		}
	};

	const { position } = useCurrentTab();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { theme, toggleTheme } = useTheme();

	return (
		<div className="fixed bottom-10 right-10 z-40">
			<div className="flex flex-row gap-6">
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
