import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, SunMedium } from "lucide-react";

export default function ThemeSwitch() {
	const [theme, setTheme] = useState<string>("light");
	document.documentElement.classList.toggle("dark", theme === "dark");
	return (
		<Button
			variant={"outline"}
			size="icon"
			className="[&_svg]:size-8 border-none w-min h-min hover:text-primary hover:bg-primary-foreground absolute top-4 right-4 shadow-none focus-visible:outline-none focus:bg-background"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
		>
			{theme === "light" ? <Moon /> : <SunMedium />}
		</Button>
	);
}
