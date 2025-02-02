import GuitarTabCreator from "./guitar-tab-creator";
import BreadCrumbs from "./components/breadcrumb";
import { useState } from "react";
import ThemeSwitch from "./components/ThemeSwitch";
import TabName from "./components/TabName";
import { NameContext } from "@/contexts/NameContext";
import { ThemeContext } from "./contexts/ThemeContext";

export default function App() {
	// const theme = useContext(ThemeContext);
	const [theme, setTheme] = useState("dark");
	const [tabName, setTabName] = useState("");
	return (
		<NameContext.Provider value={{ tabName, setTabName }}>
			<ThemeContext.Provider value={{ theme, setTheme }}>
				<main className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition ease-out">
					<BreadCrumbs />
					<div className="flex flex-col justify-start w-full p-24">
						<TabName />
						<GuitarTabCreator />

						<div className="flex justify-between items-center">
							<div>
								<p className="text-sm text-tab">
									Click to increment fret number
								</p>
								<p className="text-sm text-tab">
									Right-click to switch note open/mute/off
								</p>
							</div>
						</div>
						<ThemeSwitch />
					</div>
				</main>
			</ThemeContext.Provider>
		</NameContext.Provider>
	);
}
