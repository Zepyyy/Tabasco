import { Link2, Pen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function TabLink(props: {
	link: string;
	onLinkChange: (link: string) => void;
}) {
	const [editingLink, setEditingLink] = useState(false);
	const [tempLink, setTempLink] = useState(props.link);

	const toggleEditingLink = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		if (!editingLink) {
			setTempLink(props.link);
		}
		setEditingLink(!editingLink);
	};

	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (editingLink) {
			inputRef.current?.focus();
			inputRef.current?.select();
		}
	}, [editingLink]);

	if (!props.link && !editingLink) {
		return (
			<span
				className="inline-flex items-center gap-1.5 cursor-pointer hover:bg-primary/6 rounded-md px-1 -mx-1"
				onClick={toggleEditingLink}
			>
				<Link2 className="size-3.5" aria-hidden />
				<span className="text-xs">Add Link</span>
			</span>
		);
	}

	return (
		<span className="group/link relative flex min-w-0 items-center gap-1.5 py-0.5 text-xs">
			<a
				href={props.link}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-1.5"
				onClick={(e) => {
					if (editingLink) {
						e.preventDefault();
					}
				}}
			>
				<Link2 className="size-3.5 text-muted-foreground" aria-hidden />
				<input
					className={cn(
						"rounded-md bg-transparent border-none outline-none transition-colors px-1 py-0.5",
						editingLink
							? "ring-1 ring-primary/25 bg-primary/6 cursor-text"
							: "ring-1 ring-transparent",
					)}
					value={editingLink ? tempLink : props.link}
					placeholder="Add Link"
					disabled={!editingLink}
					onChange={(e) => setTempLink(e.target.value)}
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							props.onLinkChange(tempLink);
							setEditingLink(false);
						}
						if (e.key === "Escape") {
							e.preventDefault();
							setTempLink(props.link);
							setEditingLink(false);
						}
					}}
					onBlur={() => {
						if (editingLink) {
							props.onLinkChange(tempLink);
							setEditingLink(false);
						}
					}}
					ref={inputRef}
					style={{ width: editingLink ? "200px" : "auto" }}
				/>
			</a>
			<button
				className="hidden group-hover/link:inline-flex group-focus-within/link:inline-flex"
				aria-label={editingLink ? "Done" : "Edit link"}
				onClick={toggleEditingLink}
				style={{ padding: "2px" }}
			>
				<Pen className="size-3" />
			</button>
		</span>
	);
}
