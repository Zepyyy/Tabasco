import { Input } from "./components/ui/input";
import GuitarTabCreator from "./guitar-tab-creator";
import { ThemeContext } from "./contexts/ThemeContext";

import BreadCrumbs from "./components/breadcrumb";
import { useContext } from "react";
import ThemeSwitch from "./components/ThemeSwitch";

export default function App() {
	const theme = useContext(ThemeContext);

	return (
		<ThemeContext.Provider value={theme}>
			<main className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition ease-out">
				<BreadCrumbs />
				<div className="flex flex-col justify-start w-full p-24">
					<Input
						type="text"
						placeholder="Enter tab name"
						className="font-bold mb-4 border-none shadow-none focus-visible:ring-0 w-1/6 text-3xl md:text-4xl py-0 h-fit"
					/>
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
	);
}
