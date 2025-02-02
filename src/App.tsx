import GuitarTabCreator from "./guitar-tab-creator";
import BreadCrumbs from "./components/breadcrumb";
import { useState } from "react";
import ThemeSwitch from "./components/ThemeSwitch";
import TabName from "./components/TabName";
import { NameContext } from "@/contexts/NameContext";
import { ThemeContext } from "./contexts/ThemeContext";
import { Button } from "./components/ui/button";
export default function App() {
	// const theme = useContext(ThemeContext);
	const [theme, setTheme] = useState("dark");
	const [tabName, setTabName] = useState("");

	const handleLocalStorageCall = () => {
		const defaultSheets = [
			{ tabName: "Second", position: 1 },
			{ tabName: "First", position: 0 },
			{ tabName: "Third", position: 2 },
		];

		// localStorage.removeItem("sheets");

		localStorage.setItem("sheets", JSON.stringify(defaultSheets));
		console.log("Local Storage Reset");
	};

	return (
		<NameContext.Provider value={{ tabName, setTabName }}>
			<ThemeContext.Provider value={{ theme, setTheme }}>
				<main className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition ease-out !pointer-events-auto">
					<ThemeSwitch />
					<BreadCrumbs />
					<div className="flex flex-col justify-start w-full p-24">
						<TabName />
						<GuitarTabCreator />

						<div className="flex flex-col justify-between gap-1 mt-4">
							<p className="text-sm text-tab">
								Click to increment fret number
							</p>
							<p className="text-sm text-tab">
								Right-click to switch note open/mute/off
							</p>
						</div>
						<Button
							variant="default"
							onClick={handleLocalStorageCall}
							className="hover:bg-primary hover:text-primary-foreground w-fit mt-10"
						>
							Reset Local Storage
						</Button>
					</div>
				</main>
			</ThemeContext.Provider>
		</NameContext.Provider>
	);
}
