import { Analytics } from "@vercel/analytics/react";
import { AlertCircleIcon, Eraser, Import } from "lucide-react";
import { NavLink } from "react-router";
import img from "@/assets/QS_dark_round.png";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import GuitarTabCreator from "./components/guitar-tab-creator";
import LockSwitcher from "./components/LockSwitcher";
import TabsDropdownMenu from "./components/TabsDropdownMenu";
import ThemeSwitcher from "./components/ThemeSwitcher";
import Providers from "./providers/Providers";

export default function ModernApp() {
	return (
		<Providers>
			<ModernAppContent />
			<Analytics />
		</Providers>
	);
}

const ModernAppContent = () => {
	return (
		<div>
			<div className="sm:hidden grid w-full items-start m-4 max-w-max">
				<Alert variant={"destructive"}>
					<AlertCircleIcon />
					<AlertTitle>Not recommended for small screens</AlertTitle>
					<AlertDescription>
						Please consider switching to a laptop
					</AlertDescription>
				</Alert>
			</div>
			<main className="flex min-h-screen transition ease-out pointer-events-auto! text-xl flex-col font-Bricolage">
				<div className="flex flex-row items-center w-full">
					<div className="flex h-15 w-fit px-4 items-center justify-center border-y border-r border-foreground first:border-l bg-background text-sm">
						<NavLink
							to="https://quentinstubecki.fr/"
							className={
								"w-full h-full flex items-center justify-center gap-2 p-3"
							}
						>
							<img
								src={img}
								alt="quentinstubecki.fr"
								className="h-10 w-10 aspect-square"
							/>
							quentinstubecki.fr/
						</NavLink>
					</div>
					<div className="flex h-15 w-full items-center justify-center border-y border-r border-foreground bg-background cursor-pointer hover:bg-primary/10 transition">
						<TabsDropdownMenu />
					</div>
					<div
						className={
							"flex h-15 min-w-15 items-center justify-center border-y border-r border-foreground bg-background cursor-pointer"
						}
					>
						<LockSwitcher />
					</div>
					<div
						className="flex h-15 w-15 px-4 items-center justify-center border-y border-r border-foreground bg-background cursor-pointer"
						onClick={() => console.log("Clicked")}
					>
						<Import />
						three
					</div>
					<div
						className="flex h-15 w-15 px-4 items-center justify-center border-y border-r border-foreground bg-background cursor-pointer"
						onClick={() => console.log("Clicked")}
					>
						<Eraser />
					</div>
					<div className="flex h-15 min-w-15 items-center justify-center border-y border-r border-foreground bg-background">
						<ThemeSwitcher />
					</div>
				</div>
				<div className="flex flex-col justify-start w-full px-4 py-4">
					<div className="px-4">
						<GuitarTabCreator />
					</div>
				</div>
			</main>
		</div>
	);
};
