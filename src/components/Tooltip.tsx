import { cn } from "@/lib/utils";
import { TooltipSide } from "@/types/guitar-tab";

const tooltipSideClasses: Record<TooltipSide, string> = {
	top: "bottom-full mb-1.5 left-1/2 -translate-x-1/2",
	bottom: "top-full mt-1.5 left-1/2 -translate-x-1/2",
	left: "right-full mr-1.5 top-1/2 -translate-y-1/2",
	right: "left-full ml-1.5 top-1/2 -translate-y-1/2",
};

export const Tooltip = ({
	children,
	className,
	side = "left",
}: {
	children: React.ReactNode;
	className?: string;
	side?: TooltipSide;
}) => (
	<span
		className={cn(
			"whitespace-nowrap absolute rounded-lg bg-foreground/70 px-2 py-1 text-xs font-semibold text-background shadow-sm duration-200 font-Bricolage group-hover/tooltip:opacity-100 opacity-0 transition-opacity pointer-events-none z-50",
			tooltipSideClasses[side],
			className,
		)}
	>
		{children}
	</span>
);
