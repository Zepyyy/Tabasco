import { Pen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGuitarTab } from "@/hooks/useGuitarTab";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function TabName({
	handleNameChange,
}: {
	handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	const { name } = useGuitarTab();

	const [editingName, setEditingName] = useState(false);
	const [tempName, setTempName] = useState(name);

	const toggleEditingName = () => {
		if (!editingName) {
			setTempName(name);
		}
		setEditingName(!editingName);
	};

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editingName) {
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	}, [editingName]);

	return (
		<div className="group/name relative flex min-w-0 items-center gap-2 py-1">
			<input
				className={cn(
					"min-w-0 flex-1 truncate rounded-md bg-transparent pb-0.5 font-title text-4xl font-medium leading-snug tracking-tight text-foreground outline-none italic transition-colors sm:text-5xl",
					editingName
						? "bg-primary/[0.06] ring-1 ring-primary/25"
						: "ring-1 ring-transparent",
				)}
				value={editingName ? tempName : name}
				placeholder="Untitled"
				disabled={!editingName}
				onChange={(e) => setTempName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleNameChange({
							...e,
							target: { ...e.target, value: tempName },
						} as React.ChangeEvent<HTMLInputElement> &
							React.KeyboardEvent<HTMLInputElement>);
						setEditingName(false);
					}
					if (e.key === "Escape") {
						setTempName(name);
						setEditingName(false);
					}
				}}
				onBlur={() => {
					if (editingName) {
						handleNameChange({
							target: { value: tempName },
						} as React.ChangeEvent<HTMLInputElement>);
						setEditingName(false);
					}
				}}
				ref={inputRef}
			/>
			<Button
				className="hidden group-hover/name:flex group-focus-within/name:flex"
				variant={editingName ? "default" : "ghost"}
				size={"icon-sm"}
				onClick={() => {
					toggleEditingName();
				}}
				aria-label={editingName ? "Done renaming" : "Rename tab"}
			>
				<Pen className="size-4" />
			</Button>
		</div>
	);
}
