import { cva } from "class-variance-authority";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-primary-hover shadow",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/75 shadow-sm",
				outline:
					"bg-background text-primary hover:bg-primary/5 hover:text-primary border-2 border-primary",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary hover:underline underline-offset-4",
				deep: "bg-primary text-primary-foreground hover:bg-primary/80 shadow",
				shallow:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow",
				transparent: "bg-background text-foreground",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-sm px-3 text-xs",
				lg: "h-10 rounded-sm px-8",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export { buttonVariants };
