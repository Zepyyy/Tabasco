import { Analytics } from "@vercel/analytics/react";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Capo from "./components/Capo";
import GuitarTabCreator from "./components/guitar-tab-creator";
import Gui from "./components/SettingsMenu";
import TabsDropdownMenuModern from "./components/TabsDropdownMenuModern";
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
				<div className="inline-flex items-center justify-between w-full p-6">
					<div className="flex w-fit ">
						<TabsDropdownMenuModern />
					</div>
				</div>
				<div className="flex flex-col justify-start w-full px-4 py-4">
					<div className="flex flex-row gap-4">
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
