import { Analytics } from "@vercel/analytics/react";
import { AlertCircleIcon, MouseLeft, MouseRight } from "lucide-react";
import { useState } from "react";
import { AppSidebar } from "./components/Navigation/app-sidebar";
import GuitarTabCreator from "./components/Page/guitar-tab-creator";
import TabName from "./components/Page/TabName";
import Toolbar from "./components/Settings/Gui";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { Separator } from "./components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "./components/ui/sidebar";
import { useTabOperations } from "./hooks/useTabOperations";
import Providers from "./providers/Providers";

const AppContent = () => {
	const [editingSections, setEditingSections] = useState(false);
	const toggleEditingSections = () => {
		setEditingSections(!editingSections);
	};

	const { handleRename } = useTabOperations();
	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		handleRename(e.target.value);
	};

	return (
		<SidebarProvider defaultOpen={true} className="noise">
			<AppSidebar />
			<SidebarInset className="flex min-h-svh flex-col">
				<header className="drag-region flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
					<SidebarTrigger />
					<Separator
						orientation="vertical"
						className="mr-1 data-[orientation=vertical]:h-4"
					/>
					<Toolbar
						editingSections={editingSections}
						toggleEditingSections={toggleEditingSections}
					/>
				</header>
				<main className="flex flex-1 flex-col overflow-y-auto">
					<div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pt-7 pb-12 lg:px-10">
						<div className="sm:hidden">
							<Alert variant="destructive">
								<AlertCircleIcon />
								<AlertTitle>Not recommended for small screens</AlertTitle>
								<AlertDescription>
									Please consider switching to a laptop
								</AlertDescription>
							</Alert>
						</div>
						<TabName handleNameChange={handleNameChange} />
						<p className="mt-1.5 mb-5 flex items-center gap-5 text-xs text-muted-foreground">
							<span className="inline-flex items-center gap-1.5">
								<MouseLeft className="size-3.5" aria-hidden />
								sets the fret number
							</span>
							<span className="inline-flex items-center gap-1.5">
								<MouseRight className="size-3.5" aria-hidden />
								cycles open / muted / off
							</span>
						</p>
						<GuitarTabCreator
							editingSections={editingSections}
							toggleEditingSections={toggleEditingSections}
						/>
					</div>
				</main>
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
