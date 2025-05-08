import GuitarTabCreator from "./components/guitar-tab-creator";
import BreadCrumbs from "./components/breadcrumb";
import { useState } from "react";
import TabName from "./components/TabName";
import { db } from "./db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { TabsContext } from "./contexts/TabsContext";
import { NameContext } from "./contexts/NameContext";
import { Analytics } from "@vercel/analytics/react";
import GUI from "./components/GUI-menu";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
	const [tabName, setTabName] = useState("");
	const tabs =
		useLiveQuery(() => db.TabInfo.orderBy("position").toArray()) || [];

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<TabsContext.Provider value={tabs}>
				<NameContext.Provider value={{ tabName, setTabName }}>
					<main className="flex min-h-screen transition ease-out !pointer-events-auto text-xl">
						<BreadCrumbs />
						<div className="flex flex-col justify-start w-full p-24">
							<TabName />
							<GuitarTabCreator />
							<div className="flex flex-col justify-between gap-1 mt-4">
								<p className="text-xl text-tab font-serifText">
									Click to increment fret number
								</p>
								<p className="text-xl text-tab font-serifText">
									Right-click to switch note open/mute/off
								</p>
							</div>
						</div>
						<div className="absolute bottom-0 left-0 w-full flex flex-col items-center justify-end gap-4 p-4 z-10">
							<GUI />
						</div>
					</main>
					<Analytics />
				</NameContext.Provider>
			</TabsContext.Provider>
		</ThemeProvider>
	);
}
