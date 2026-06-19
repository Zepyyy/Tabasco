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
		<div className="relative flex flex-row items-center gap-4 py-2 rounded-2xl min-w-fit group/name">
			<input
				className={cn(
					"text-5xl font-serif-title p-2 border-2 border-transparent",
					editingName && "border-primary/70 rounded-sm bg-primary/20",
				)}
				value={editingName ? tempName : name}
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
				className="group-hover/name:flex hidden"
				variant={editingName ? "default" : "ghost"}
				size={"icon-sm"}
				onClick={() => {
					toggleEditingName();
				}}
			>
				<Pen className="h-4 w-4" />
			</Button>
		</div>
	);
}
