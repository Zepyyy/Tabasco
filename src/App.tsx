import GuitarTabCreator from "./components/guitar-tab-creator";
import BreadCrumbs from "./components/breadcrumb";
import { useState } from "react";
import TabName from "./components/TabName";
import { db } from "./db/db";
import { useLiveQuery } from "dexie-react-hooks";
import { TabsContext } from "./contexts/TabsContext";
import { NameContext } from "./contexts/NameContext";
import { LockContext } from "./contexts/LockContext";
import { Analytics } from "@vercel/analytics/react";
import GUI from "./components/SettingsMenu";
import { ThemeProvider } from "./components/theme-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import Lock from "./components/Lock";

export default function App() {
	const [tabName, setTabName] = useState("");
	const tabs =
		useLiveQuery(() => db.TabInfo.orderBy("position").toArray()) || [];
	const [isLocked, setIsLocked] = useState<boolean>(
		JSON.parse(localStorage.getItem("isLocked") ?? "false"),
	);

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<LockContext.Provider value={{ isLocked, setIsLocked }}>
				<TabsContext.Provider value={tabs}>
					<NameContext.Provider value={{ tabName, setTabName }}>
						<div className="sm:hidden grid w-full items-start m-4 max-w-max">
							<Alert variant={"destructive"}>
								<AlertCircleIcon />
								<AlertTitle>Not recommended for small screens</AlertTitle>
								<AlertDescription>
									Please consider switching to a laptop
								</AlertDescription>
							</Alert>
						</div>
						<main className="flex min-h-screen transition ease-out !pointer-events-auto text-xl flex-col">
							<div className="flex flex-row items-center justify-between pt-4 px-4">
								<BreadCrumbs />
								<div className="flex flex-row gap-6">
									<Lock />
									<GUI />
								</div>
							</div>
							<div className="flex flex-col justify-start w-full px-4 py-4">
								<TabName />
								<div className="px-4">
									<GuitarTabCreator />
								</div>
								<div className="flex flex-col justify-between gap-1">
									<p className="text-xl text-tab font-serif-text">
										Click to increment fret number
									</p>
									<p className="text-xl text-tab font-serif-text">
										Right-click to switch note open/mute/off
									</p>
								</div>
							</div>
						</main>
						<Analytics />
					</NameContext.Provider>
				</TabsContext.Provider>
			</LockContext.Provider>
		</ThemeProvider>
	);
}
