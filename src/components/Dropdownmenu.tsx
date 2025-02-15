import { DropdownMenu } from "radix-ui";
import { ChevronDownIcon, Ellipsis, Plus } from "lucide-react";
import { useContext, useState } from "react";
import { NameContext } from "@/contexts/NameContext";
import addTab from "@/db/crud/AddTab";
import UpdateTabById, { updateTabPositionById } from "@/db/crud/UpdateTab";
import deleteTabById from "@/db/crud/DeleteTab";
import { TabsContext } from "@/contexts/TabsContext";
import { TabInfo } from "@/db/db";

// const defaultSheets = [
// 	{ tabName: "Powfu - Coffee for your head", position: 0, tabs: [[]] },
// 	{ tabName: "Naruto - Sadness and Sorrow", position: 1, tabs: [[]] },
// 	{ tabName: "Minecraft - Sweden", position: 2, tabs: [[]] },
// ];

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
		className="bg-background text-foreground px-2 py-1 rounded-md w-full border border-tab/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all"
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

// [{"tabName":"Second","position":1},{"tabName":"First","position":0},{"tabName":"Third","position":2}]
// sheets:"[{"tabName":"Powfu - Coffee for your head","position":0},{"tabName":"Naruto - Sadness and Sorrow","position":1},{"tabName":"Minecraft - Sweden","position":2}]"

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
		<DropdownMenu.Item
			className="group relative flex h-7 select-none items-center pl-3 pr-4 leading-none text-tab outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-foreground/10"
			onClick={onRename}
			key={`Rename-${position}`}
		>
			Rename
		</DropdownMenu.Item>
		<DropdownMenu.Item
			className="group relative flex h-7 select-none items-center pl-3 pr-4 leading-none text-tab outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-foreground/10"
			onClick={() => console.log("Duplicate")}
			key={`Duplicate-${position}`}
		>
			Duplicate
		</DropdownMenu.Item>
		<DropdownMenu.Item
			className="group relative flex h-7 select-none items-center pl-3 pr-4 leading-none text-tab outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-foreground/10"
			onClick={onMoveDown}
			key={`Move-${position}`}
		>
			Move Down
		</DropdownMenu.Item>
		<DropdownMenu.Separator className="h-[0.5px] bg-tab" />
		<DropdownMenu.Item
			className="group relative flex h-6 select-none items-center pl-3 pr-4 leading-none text-destructive-foreground outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-destructive/10"
			onClick={onDelete}
			key={`Delete-${position}`}
		>
			Delete
		</DropdownMenu.Item>
	</>
);

export default function Dropdownmenu() {
	const { tabName: tabName } = useContext(NameContext);
	const tabs = useContext(TabsContext);
	const [id, setId] = useState("");
	const [editingName, setEditingName] = useState<string | null>(null);

	const handleRenameSubmit = (oldName: string, newName: string) => {
		if (newName && newName !== oldName) {
			UpdateTabById(id, newName);
		}
		setId("");
		setEditingName(null);
	};

	const handleMoveSubmit = (oldPosition: string) => {
		const newPosition = parseInt(oldPosition) + 1;
		// Check if the new position is valid (i.e., it exists in the tabs array)
		if (newPosition >= tabs.length) return; // Prevent moving beyond the last tab
		tabs.map((tab: TabInfo) => {
			if (tab.position === oldPosition) {
				updateTabPositionById(oldPosition, newPosition.toString());
			}
			// if (tab.position === newPosition.toString()) {
			// 	console.log("tab.position matched newPosition");
			// 	updateTabPositionById(newPosition.toString(), oldPosition);
			// }
			return;
		});
	};

	return (
		<>
			{editingName ? (
				<RenameInput
					initialValue={editingName}
					onRename={(newName) => handleRenameSubmit(editingName, newName)}
					onCancel={() => setEditingName(null)}
				/>
			) : (
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild>
						<button
							className="appearance-none green-400 border-none inline-flex items-center justify-center rounded-md text-tab transition-all text-xl font-serifText gap-2"
							aria-label="Customise options"
						>
							{tabName || "Unnamed"}
							<ChevronDownIcon size={24} />
						</button>
					</DropdownMenu.Trigger>
					<div>qsd: {id}</div>

					<DropdownMenu.Portal>
						<DropdownMenu.Content
							className="ml-10 bg-background border border-tab rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade z-40 text-lg font-serifText"
							sideOffset={4}
						>
							<DropdownMenu.Item className="group relative flex h-7 select-none items-center leading-none text-tab min-w-44 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-foreground/10">
								<div className="flex justify-between w-full relative items-center pl-2 pr-2 rounded-sm text-tab gap-9">
									{tabName || "Unnamed"}
									<Plus
										className="w-4 h-4 cursor-pointer"
										onClick={() => addTab({})}
									/>
								</div>
							</DropdownMenu.Item>
							<DropdownMenu.Separator className="h-[0.5px] bg-tab" />
							{tabs.map((tab: TabInfo) => (
								<DropdownMenu.Sub key={tab.position}>
									<DropdownMenu.SubTrigger className="group relative flex h-6 select-none items-center pl-2 pr-2 leading-none text-tab outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-foreground/10 my-1 last:my-0 gap-9">
										{tab.tabName}
										<div className="ml-auto group-data-[highlighted]:text-tab/50">
											<Ellipsis size={20} />
										</div>
									</DropdownMenu.SubTrigger>
									<DropdownMenu.Portal>
										<DropdownMenu.SubContent
											className="bg-background border border-tab rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] z-40 will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade text-lg font-serifText"
											sideOffset={6}
											key={tab.position}
										>
											<SheetActionsMenu
												position={tab.position}
												onRename={() => {
													setId(tab.position);
													setEditingName(tab.tabName);
												}}
												onMoveDown={() => handleMoveSubmit(tab.position)}
												onDelete={() => deleteTabById(tab.position)}
											/>
										</DropdownMenu.SubContent>
									</DropdownMenu.Portal>
								</DropdownMenu.Sub>
							))}
						</DropdownMenu.Content>
					</DropdownMenu.Portal>
				</DropdownMenu.Root>
			)}
		</>
	);
}
