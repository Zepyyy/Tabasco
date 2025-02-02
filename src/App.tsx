import { Input } from "./components/ui/input";
import GuitarTabCreator from "./guitar-tab-creator";
import { useState } from "react";
import { ThemeContext } from "./contexts/ThemeContext";
import { Button } from "./components/ui/button";
import { MoonStar, SunMedium } from "lucide-react";

export default function App() {
	const [theme, setTheme] = useState<string>("light");
	document.documentElement.classList.toggle("dark", theme === "dark");

	return (
		<ThemeContext.Provider value={theme}>
			<main className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
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
					<Button
						variant={"outline"}
						size="icon"
						className="[&_svg]:size-8 border-none w-min h-min hover:text-primary hover:bg-primary-foreground absolute top-4 right-4"
						onClick={() =>
							setTheme(theme === "light" ? "dark" : "light")
						}
					>
						{theme === "light" ? <MoonStar /> : <SunMedium />}
					</Button>
				</div>
			</main>
		</ThemeContext.Provider>
	);
}
