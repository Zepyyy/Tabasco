import { Analytics } from "@vercel/analytics/react";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import BreadCrumbs from "./components/breadcrumb";
import Capo from "./components/Capo";
import GuitarTabCreator from "./components/guitar-tab-creator";
import LockButton from "./components/LockSwitcher";
import Gui from "./components/SettingsMenu";
import TabName from "./components/TabName";
import Providers from "./providers/Providers";

const AppContent = () => {
	return (
		<>
			<div className="sm:hidden grid w-full items-start m-4 max-w-max">
				<Alert variant={"destructive"}>
					<AlertCircleIcon />
					<AlertTitle>Not recommended for small screens</AlertTitle>
					<AlertDescription>
						Please consider switching to a laptop
					</AlertDescription>
				</Alert>
			</div>
			<main className="flex min-h-screen transition ease-out pointer-events-auto! text-xl flex-col">
				<Gui />
				<div className="flex items-center justify-between w-full pt-4 px-4">
					<BreadCrumbs />
					<div className="flex w-fit p-2 rounded-lg">
						<LockButton rounded />
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
		</>
	);
};
export default function App() {
	return (
		<Providers>
			<AppContent />
			<Analytics />
		</Providers>
	);
}
