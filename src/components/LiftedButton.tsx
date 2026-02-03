import clsx from "clsx";
import { cn } from "@/lib/utils";

export default function LiftedButton(props: {
	children?: React.ReactNode;
	svg?: React.ReactNode;
	onClick?: () => void;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative group inline-block font-serif-text text-xl z-10",
				props.className,
			)}
			style={{ width: "fit-content", minWidth: "fit-content" }}
		>
			<span className="flex items-center justify-center px-2 py-1 whitespace-nowrap opacity-0 pointer-events-none gap-4">
				{props.svg}
				{props.children}
			</span>
			<div
				className={clsx(
					"flex items-center justify-center whitespace-nowrap absolute top-1.5 left-1.5 text-white px-2 py-1 rounded-lg pointer-events-none bg-shadow",
					props.children && "py-2",
					!props.children && "w-12 h-12",
				)}
			>
				<span className="whitespace-nowrap flex flex-row justify-center items-center gap-1 bg-amber-400">
					{props.svg}
					{props.children}
				</span>
			</div>
			<button
				onClick={props.onClick}
				className={clsx(
					"flex items-center justify-center absolute top-0 left-0 bg-background-light text-foreground px-2 py-1 group-hover:top-1 group-hover:left-1 z-20 rounded-lg transition-all duration-150 whitespace-nowrap gap-1",
					props.children && "py-2",
					!props.children && "w-12 h-12",
				)}
			>
				{props.svg}
				{props.children}
			</button>
		</div>
	);
}
