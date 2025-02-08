import { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { useMantineColorScheme } from "@mantine/core";

export default function ThemeSwitch() {
	const { theme, setTheme } = useContext(ThemeContext);
	const { setColorScheme } = useMantineColorScheme();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		localStorage.setItem("theme", theme);
		setColorScheme(theme === "dark" ? "dark" : "light"); // Update Mantine's color scheme
	}, [theme, setColorScheme]);

	return (
		<Button
			variant={"transparent"}
			className="absolute top-4 right-4 z-50 [&_svg]:size-6 h-fit w-fit "
			size="icon"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
		>
			{theme === "light" ? <Moon /> : <Sun />}
		</Button>
	);
}
