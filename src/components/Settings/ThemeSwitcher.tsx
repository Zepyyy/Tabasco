import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeSwitcher() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			className="flex items-center justify-center w-full h-full cursor-pointer gap-2 p-2"
			onClick={() => toggleTheme()}
		>
			{theme === "dark" ? <Sun /> : <Moon />}
		</button>
	);
}
