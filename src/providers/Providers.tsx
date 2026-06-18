import { useState } from "react";
import type { Theme } from "@/types/guitar-tab";
import LockProvider from "./LockProvider";
import ThemeProvider from "./ThemeProvider";

const isTheme = (value: string | null): value is Theme =>
	value === "light" || value === "dark";

function getInitialTheme(): Theme {
	if (typeof window === "undefined") return "light";

	const storedTheme = localStorage.getItem("theme");
	return isTheme(storedTheme) ? storedTheme : "light";
}

export default function Providers({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);
	const [locked, setLocked] = useState<boolean>(() => {
		if (typeof window === "undefined") return false;
		return JSON.parse(localStorage.getItem("locked") ?? "false");
	});

	function toggleLock() {
		setLocked(!locked);
		localStorage.setItem("locked", JSON.stringify(!locked));
	}
	function toggleTheme() {
		setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
	}

	return (
		<ThemeProvider theme={theme} toggleTheme={toggleTheme}>
			<LockProvider locked={locked} toggleLock={toggleLock}>
				{children}
			</LockProvider>
		</ThemeProvider>
	);
}
