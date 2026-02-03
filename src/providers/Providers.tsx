import { useState } from "react";
import LockProvider from "./LockProvider";
import ThemeProvider from "./ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<string>(
		localStorage.getItem("theme") || "light",
	);
	const [locked, setLocked] = useState<boolean>(() => {
		if (typeof window === "undefined") return false;
		return JSON.parse(localStorage.getItem("locked") ?? "false");
	});

	function toggleLock() {
		setLocked(!locked);
		localStorage.setItem("locked", JSON.stringify(!locked));
	}
	function toggleTheme() {
		setTheme(theme === "light" ? "dark" : "light");
		localStorage.setItem("theme", theme === "light" ? "dark" : "light");
	}

	return (
		<ThemeProvider theme={theme} toggleTheme={toggleTheme}>
			<LockProvider locked={locked} toggleLock={toggleLock}>
				{children}
			</LockProvider>
		</ThemeProvider>
	);
}
