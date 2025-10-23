import { cva } from "class-variance-authority";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-semibold transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 inset-shadow-[0_-3px_0_rgba(0,0,0,0.2)] shadow-[0_4px_4px_rgba(0,0,0,0.2)] active:inset-shadow-[0_-1px_0_rgba(0,0,0,0.2)] active:shadow-[0_4px_4px_rgba(0,0,0,0.2)] [&>*]:transform [&>*]:-translate-y-0.5 [&>*]:transition-transform [&>*]:duration-150 active:[&>*]:translate-y-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive",
				soft: "bg-soft/25 text-soft-foreground",
				outline: "bg-background text-primary border-2 border-primary",
				deep: "bg-primary text-primary-foreground",
				shallow: "bg-secondary text-secondary-foreground",
				transparent:
					"bg-background text-foreground border-none shadow-none inset-shadow-none active:shadow-none active:inset-shadow-none",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-sm px-3 text-xs",
				lg: "h-10 rounded-sm px-8",
				icon: "h-9 w-9 rounded-sm p-0 aspect-square",
				bigIcon: "p-3 aspect-square",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export { buttonVariants };
