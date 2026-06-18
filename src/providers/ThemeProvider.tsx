import { useEffect } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import type { Theme } from "@/types/guitar-tab";

export default function ThemeProvider({
	children,
	theme,
	toggleTheme,
}: {
	children: React.ReactNode;
	theme: Theme;
	toggleTheme: () => void;
}) {
	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
		localStorage.setItem("theme", theme);
	}, [theme]);

	return (
		<ThemeContext.Provider
			value={{
				theme,
				toggleTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}
