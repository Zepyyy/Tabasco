import clsx from "clsx";
import { useLiveQuery } from "dexie-react-hooks";
import {
	ChevronUp,
	CopyPlus,
	CornerRightDown,
	PenIcon,
	Plus,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import { db } from "@/db/db";
import { useTabCreation } from "@/hooks/useTabCreation";
import { useTabOperations } from "@/hooks/useTabOperations";
import { TabInfo } from "@/types/guitar-tab";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// Reusable component for the rename input
const RenameInput = ({
	initialValue,
	onRename,
	Escape,
}: {
	initialValue: string;
	onRename: (newName: string) => void;
	Escape: () => void;
}) => (
	<input
		className="bg-background text-foreground px-2 py-1 rounded-md w-full border border-tab/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-hidden transition text-xl "
		type="text"
		defaultValue={initialValue}
		autoFocus
		onClick={(e) => e.stopPropagation()}
		onBlur={(e) => onRename(e.target.value)}
		onChange={(e) => e.currentTarget.value}
		onKeyDown={(e) => {
			e.stopPropagation();
			if (e.key === "Enter") {
				onRename(e.currentTarget.value);
				Escape();
			}
			if (e.key === "Escape") {
				Escape();
			}
		}}
	/>
);

function HoverButton({
	children,
	action,
	className,
}: {
	children?: React.ReactNode;
	action?: () => void;
	className?: string;
}) {
	return (
		<Button
			variant={"soft"}
			size="bigIcon"
			onClick={() => action && action()}
			className={`aspect-square h-fit mx-1 p-1 group-hover:visible invisible flex items-center justify-center rounded [&_svg]:size-5 [&_svg]:shrink-0 border-none transition duration-200 ease-in ${className}`}
		>
			{children}
		</Button>
	);
}

export default function TabsDropdownMenuModern() {
	const tabs = useLiveQuery(() => db.TabInfo.toArray()) || [];
	const { tabName, handleRename } = useTabOperations();

	tabs.sort(
		(a, b) => Number.parseInt(a.position) - Number.parseInt(b.position),
	);

	const [editingTab, setEditingTab] = useState<{
		id: number;
		name: string;
	} | null>(null);
	const { handleAddTab, handleDuplicate } = useTabCreation();
	const { handleMove, handleDelete } = useTabOperations(tabs);

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [concernedTab, setConcernedTab] = useState<TabInfo | null>(null);
	const [upPosition, setUpPosition] = useState(false);

	return (
		<>
			{editingTab ? (
				<RenameInput
					initialValue={editingTab.name}
					onRename={(newName) => handleRename(newName)}
					Escape={() => setEditingTab(null)}
				/>
			) : (
				<>
					<DropdownMenu onOpenChange={() => setUpPosition(!upPosition)}>
						<DropdownMenuTrigger
							asChild
							className="appearance-none border-none inline-flex items-center justify-center rounded-md text-tab text-4xl font-serif-title w-full h-full m-0 p-0"
						>
							<button
								aria-label="Customise options"
								className="flex gap-1 items-center"
							>
								{tabName || "Unnamed"}
								<ChevronUp
									size={32}
									strokeWidth={2}
									className={`transition-transform duration-200 text-tab pb-1.5 ${
										upPosition ? "rotate-0" : "rotate-180"
									}`}
								/>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuPortal>
							<DropdownMenuContent
								className="flex flex-col p-2 m-0 ml-6 z-40 font-serif-text text-2xl w-150 min-w-fit bg-background-light dark:border dark:border-foreground/30 border-secondary shadow-lg rounded-lg"
								sideOffset={4}
							>
								<DropdownMenuLabel>
									<div className="flex justify-between w-full relative items-center rounded-md text-foreground text-2xl font-normal h-6 px-2">
										Your tabs
										<div className="flex flex-row items-center gap-2 group">
											<Button
												variant="transparent"
												size="icon"
												tooltip="Add a new tab"
												// className="bg-background"
												onClick={() => handleAddTab()}
											>
												<Plus />
											</Button>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator className="my-2 bg-tag" />
								{tabs.map((tab: TabInfo) => (
									<div
										key={tab.id}
										className="flex flex-row group h-12 items-center justify-center text-foreground bg-background-light hover:bg-secondary transition-all duration-75 rounded-md"
									>
										<NavLink
											to={`/sheet/${tab.position}`}
											key={tab.id}
											className={({ isActive, isPending }) =>
												clsx(
													"h-full w-full group-hover:visible flex items-center justify-start gap-1 rounded-lg hover:dark:bg-primary/30",
													isActive
														? "bg-primary/90 text-background-light dark:text-foreground hover:bg-primary "
														: isPending
															? "text-foreground bg-foreground/10 hover:bg-foreground/20"
															: "",
												)
											}
										>
											<div className="flex justify-start ml-2">
												<HoverButton
													className="hover:bg-destructive bg-background text-danger-000 transition-colors duration-150"
													action={() => {
														setIsDialogOpen(true);
														setConcernedTab(tab);
													}}
												>
													<Trash2 size={20} />
												</HoverButton>
											</div>

											<div className="flex flex-row h-full w-full items-center">
												{tab.tabName || "Unnamed"}
											</div>
											<div className="flex justify-end">
												<HoverButton
													action={() =>
														setEditingTab({
															id: tab.id,
															name: tab.tabName || "Unnamed",
														})
													}
												>
													<PenIcon size={20} />
												</HoverButton>

												<HoverButton
													action={() =>
														handleDuplicate({
															position: tab.position,
															name: tab.tabName,
															capo: tab.capo,
														})
													}
												>
													<CopyPlus size={20} />
												</HoverButton>
												<HoverButton
													className="mr-2"
													action={() => handleMove(tab.id, tab.position)}
												>
													<CornerRightDown size={20} />
												</HoverButton>
											</div>
										</NavLink>
									</div>
								))}
							</DropdownMenuContent>
						</DropdownMenuPortal>
					</DropdownMenu>

					<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Are you sure?</AlertDialogTitle>
								<AlertDialogDescription>
									This action cannot be undone. This will permanently delete the
									tab.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction
									onClick={async () => {
										await handleDelete(
											concernedTab?.id,
											concernedTab?.position,
										);
									}}
								>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</>
			)}
		</>
	);
}
