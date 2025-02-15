/* eslint-disable @typescript-eslint/no-unused-vars */
import GuitarTabCreator from "./components/guitar-tab-creator";
import BreadCrumbs from "./components/breadcrumb";
import { useState } from "react";
import ThemeSwitch from "./components/ThemeSwitch";
import TabName from "./components/TabName";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme as mantineTheme } from "@/theme";
import { ThemeContext } from "./contexts/ThemeContext";
import { Button } from "./components/ui/button";
import { db } from "./db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { TabsContext } from "./contexts/TabsContext";
import { NameContext } from "./contexts/NameContext";
import { PositionContext } from "./contexts/PositionContext";
import { Analytics } from "@vercel/analytics/next";

export default function App() {
	const [tabName, setTabName] = useState("");
	const [theme, setTheme] = useState("dark");
	const [position, setPosition] = useState("0");
	const tabs =
		useLiveQuery(() => db.TabInfo.orderBy("position").toArray()) || [];

	return (
		<MantineProvider theme={mantineTheme} defaultColorScheme="dark">
			<ThemeContext.Provider value={{ theme, setTheme }}>
				<PositionContext.Provider value={{ position, setPosition }}>
					<TabsContext.Provider value={tabs}>
						<NameContext.Provider value={{ tabName, setTabName }}>
							<main className="flex min-h-screen transition ease-out !pointer-events-auto text-base">
								<ThemeSwitch />
								<BreadCrumbs />
								<div className="flex flex-col justify-start w-full p-24">
									<TabName />
									<GuitarTabCreator />
									<div className="flex flex-col justify-between gap-1 mt-4">
										<p className="text-lg text-tab font-serifText">
											Click to increment fret number
										</p>
										<p className="text-lg text-tab font-serifText">
											Right-click to switch note open/mute/off
										</p>
									</div>
									<Button
										variant="outline"
										className="w-fit mt-10"
										onClick={() => console.log("tabs", tabs)}
									>
										log trabs
									</Button>
								</div>
							</main>
							<Analytics />
						</NameContext.Provider>
					</TabsContext.Provider>
				</PositionContext.Provider>
			</ThemeContext.Provider>
		</MantineProvider>
	);
}
