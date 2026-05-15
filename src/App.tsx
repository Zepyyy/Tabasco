import { Analytics } from "@vercel/analytics/react";
import { AlertCircleIcon, MouseLeft, MouseRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppSidebar } from "./components/Navigation/app-sidebar";
import GuitarTabCreator from "./components/Page/guitar-tab-creator";
import Capo from "./components/Settings/Capo";
import Gui from "./components/Settings/Gui";
import { Separator } from "./components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "./components/ui/sidebar";
import Providers from "./providers/Providers";

const AppContent = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="min-h-screen transition ease-out pointer-events-auto! text-sm">
				<div className="sm:hidden grid w-full items-start m-4 max-w-max">
					<Alert variant="destructive">
						<AlertCircleIcon />
						<AlertTitle>Not recommended for small screens</AlertTitle>
						<AlertDescription>
							Please consider switching to a laptop
						</AlertDescription>
					</Alert>
				</div>
				<div className="border-b border-border bg-sidebar drag-region flex h-13 items-center px-3 sm:px-5">
					<div className="flex shrink-0 items-center justify-end gap-2">
						<SidebarTrigger />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Gui />
					</div>
				</div>

				<div className="flex flex-row justify-center w-full p-6 gap-12">
					<div className="border-none flex items-center justify-start flex-nowrap w-full h-full"></div>
					<div className="flex flex-col items-start justify-center min-w-fit flex-nowrap text-sm font-Bricolage gap-2">
						<div className="flex flex-row gap-1 items-center">
							<MouseLeft className="size-5" />
							<p> Increment fret number </p>
						</div>

						<div className="flex flex-row gap-1 items-center">
							<MouseRight className="size-5" />
							<p>Switch note open/mute/off</p>
						</div>
					</div>

					<div className="flex items-center justify-end gap-2">
						<Capo />
					</div>
				</div>
				<div className="flex flex-col justify-start w-full p-4">
					<GuitarTabCreator />
				</div>
			</SidebarInset>
		</SidebarProvider>
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
