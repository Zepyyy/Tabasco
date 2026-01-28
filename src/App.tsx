import { Analytics } from "@vercel/analytics/react";
import { useLiveQuery } from "dexie-react-hooks";
import { AlertCircleIcon } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import BreadCrumbs from "./components/breadcrumb";
import Capo from "./components/Capo";
import GuitarTabCreator from "./components/guitar-tab-creator";
import Lock from "./components/Lock";
import Gui from "./components/SettingsMenu";
import TabName from "./components/TabName";
import { ThemeProvider } from "./components/theme-provider";
import { CapoContext } from "./contexts/CapoContext";
import { LockContext } from "./contexts/LockContext";
import { NameContext } from "./contexts/NameContext";
import { TabsContext } from "./contexts/TabsContext";
import { db } from "./db/db";

export default function App() {
	const [tabName, setTabName] = useState("");
	const [capo, setCapo] = useState(-1);

	const tabs =
		useLiveQuery(() => db.TabInfo.orderBy("position").toArray()) || [];
	const [isLocked, setIsLocked] = useState<boolean>(
		JSON.parse(localStorage.getItem("isLocked") ?? "false"),
	);
	const [trigger, setTrigger] = useState<boolean>(false);

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<LockContext.Provider
				value={{ isLocked, setIsLocked, trigger, setTrigger }}
			>
				<TabsContext.Provider value={tabs}>
					<NameContext.Provider value={{ tabName, setTabName }}>
						<CapoContext.Provider value={{ capo, setCapo }}>
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
										<Gui />
									</div>
								</div>
								<div className="flex flex-col justify-start w-full px-4 py-4">
									<div className="flex flex-row gap-4">
										<TabName />
										<Capo />
									</div>
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
						</CapoContext.Provider>
					</NameContext.Provider>
				</TabsContext.Provider>
			</LockContext.Provider>
		</ThemeProvider>
	);
}
