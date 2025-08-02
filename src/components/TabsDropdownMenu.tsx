import { Plus } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router";
import { useTabOperations } from "@/hooks/useTabOperations";
import { TabsContext } from "@/contexts/TabsContext";
import { NameContext } from "@/contexts/NameContext";
import { TabInfo } from "@/db/db";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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

// Reusable component for the rename input
const RenameInput = ({
	initialValue,
	onRename,
	onCancel,
}: {
	initialValue: string;
	onRename: (newName: string) => void;
	onCancel: () => void;
}) => (
	<input
		className="bg-background text-foreground px-2 py-1 rounded-md w-full border border-tab/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-hidden transition-all"
		type="text"
		defaultValue={initialValue}
		autoFocus
		onClick={(e) => e.stopPropagation()}
		onBlur={(e) => onRename(e.target.value)}
		onKeyDown={(e) => {
			e.stopPropagation();
			if (e.key === "Enter") onRename(e.currentTarget.value);
			if (e.key === "Escape") {
				onCancel();
			}
		}}
	/>
);

// Reusable component for sheet actions menu
const SheetActionsMenu = ({
	position,
	onRename,
	onMoveDown,
	onDelete,
}: {
	position: string;
	onRename: () => void;
	onMoveDown: () => void;
	onDelete: () => void;
}) => (
	<>
		<DropdownMenuItem
			className="group flex h-8 select-none items-center text-tab outline-hidden data-disabled:pointer-events-none focus:bg-foreground/10"
			onClick={onRename}
			key={`Rename-${position}`}
		>
			Rename
		</DropdownMenuItem>
		<DropdownMenuItem
			className="group flex h-8 select-none items-center text-tab outline-hidden data-disabled:pointer-events-none focus:bg-foreground/10"
			// onClick={() => console.log("Duplicate")}
			key={`Duplicate-${position}`}
		>
			Duplicate
		</DropdownMenuItem>
		<DropdownMenuItem
			className="group flex h-8 select-none items-center text-tab outline-hidden data-disabled:pointer-events-none focus:bg-foreground/10"
			onClick={onMoveDown}
			key={`Move-${position}`}
		>
			Move Down
		</DropdownMenuItem>
		<DropdownMenuSeparator className="bg-tab m-0" />
		<DropdownMenuItem
			className="group cursor-pointer flex h-7 select-none items-center leading-none outline-hidden data-disabled:pointer-events-none text-destructive-foreground focus:bg-destructive/10 focus:text-destructive-foreground pt-1"
			onClick={onDelete}
			key={`Delete-${position}`}
		>
			Delete
		</DropdownMenuItem>
	</>
);

export default function TabsDropdownMenu() {
	const { tabName, setTabName } = useContext(NameContext);
	const tabs = useContext(TabsContext);
	const [editingTab, setEditingTab] = useState<{
		id: number;
		name: string;
	} | null>(null);
	const { handleAddTab, handleRename, handleMove, handleDelete } =
		useTabOperations();

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [concernedTab, setConcernedTab] = useState<TabInfo | null>(null);

	const handleRenameSubmit = (id: number, newName: string) => {
		setTabName(newName);
		handleRename(id, newName);
		setEditingTab(null);
	};

	return (
		<>
			{editingTab ? (
				<RenameInput
					initialValue={editingTab.name}
					onRename={(newName) => handleRenameSubmit(editingTab.id, newName)}
					onCancel={() => setEditingTab(null)}
				/>
			) : (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger
							asChild
							className="appearance-none border-none inline-flex items-center justify-center rounded-md text-tab transition-all text-xl font-serif-text gap-2"
						>
							<button aria-label="Customise options">
								{tabName || "Unnamed"}
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuPortal>
							<DropdownMenuContent
								className="flex flex-col p-0 m-0 bg-background/80 backdrop-blur-xs shadow-lg ml-10 z-40 font-serif-text text-xl"
								sideOffset={4}
							>
								<DropdownMenuLabel>
									<div className="flex justify-between w-full relative items-center rounded-sm text-tab gap-8 text-xl">
										Your tabs
										<Plus
											className="w-4 h-4 cursor-pointer"
											onClick={() => handleAddTab()}
										/>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator className="m-0 bg-tab" />
								{tabs.map((tab: TabInfo) => (
									<Link to={`/sheet/${tab.position}`} key={tab.id}>
										<DropdownMenuSub key={tab.id}>
											<DropdownMenuSubTrigger className="group relative flex h-8 select-none items-center pl-2 pr-2 outline-hidden data-disabled:pointer-events-none my-1 last:my-0 gap-9 text-xl data-[state=open]:bg-foreground/10 text-tab bg-background focus:bg-foreground/10 focus:text-tab">
												{tab.tabName || "Unnamed"}
												<div className="ml-auto focus:text-tab/50 group-data-highlighted:text-tab/50"></div>
											</DropdownMenuSubTrigger>
											<DropdownMenuPortal>
												<DropdownMenuSubContent
													className="z-50 bg-background text-foreground shadow-lg border border-tab font-serif-text p-0"
													sideOffset={6}
													key={tab.id}
												>
													<SheetActionsMenu
														position={tab.position}
														onRename={() => {
															setEditingTab({
																id: tab.id,
																name: tab.tabName,
															});
														}}
														onMoveDown={() => {
															handleMove(tab.id, tab.position);
														}}
														onDelete={() => {
															setIsDialogOpen(true);
															setConcernedTab(tab);
														}}
													/>
												</DropdownMenuSubContent>
											</DropdownMenuPortal>
										</DropdownMenuSub>
									</Link>
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
