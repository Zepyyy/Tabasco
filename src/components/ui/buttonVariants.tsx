import { cva } from "class-variance-authority";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
				destructive:
					"bg-destructive/10 text-destructive-foreground hover:bg-destructive/25 shadow-xs",
				SoftDestructive:
					"bg-soft/25 text-soft-foreground hover:bg-soft/45 shadow-xs",
				outline:
					"bg-background text-primary hover:bg-primary/5 hover:text-primary border-2 border-primary",
				deep: "bg-primary text-primary-foreground hover:bg-primary/80 shadow-sm",
				shallow:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
				transparent: "bg-background text-foreground",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-sm px-3 text-xs",
				lg: "h-10 rounded-sm px-8",
				icon: "h-9 w-9 rounded-sm p-0 aspect-square",
				"icon-resize": "ounded-sm p-0 h-auto aspect-square",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export { buttonVariants };
