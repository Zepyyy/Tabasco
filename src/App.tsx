import GuitarTabCreator from "./guitar-tab-creator";
import BreadCrumbs from "./components/breadcrumb";
import { useState } from "react";
import ThemeSwitch from "./components/ThemeSwitch";
import TabName from "./components/TabName";
import { NameContext } from "@/contexts/NameContext";
import "@mantine/core/styles.css";
import { Button, MantineProvider } from "@mantine/core";
import { theme as mantineTheme } from "@/theme";
import { ThemeContext } from "./contexts/ThemeContext";

export default function App() {
	const [tabName, setTabName] = useState("");
	const [theme, setTheme] = useState("light");

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
		<MantineProvider theme={mantineTheme} defaultColorScheme="dark">
			<ThemeContext.Provider value={{ theme, setTheme }}>
				<NameContext.Provider value={{ tabName, setTabName }}>
					<main className="flex min-h-screen transition ease-out !pointer-events-auto">
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
							// TODO: modify the outline button colors, primary
							always
							<Button
								variant="outline"
								className="w-fit mt-10"
								onClick={handleLocalStorageCall}
							>
								Reset Local Storage
							</Button>
						</div>
					</main>
				</NameContext.Provider>
			</ThemeContext.Provider>
		</MantineProvider>
	);
}
