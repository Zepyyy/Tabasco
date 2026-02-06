import { cva } from "class-variance-authority";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-background-light text-foreground",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive",
				soft: "bg-background-light text-foreground",
				outline: "bg-background text-primary border-2 border-primary",
				deep: "bg-primary text-primary-foreground",
				shallow: "bg-secondary text-secondary-foreground",
				transparent:
					"bg-background text-foreground border-none shadow-none inset-shadow-none active:shadow-none active:inset-shadow-none",
				link: "bg-background text-foreground border-none shadow-none inset-shadow-none active:shadow-none active:inset-shadow-none flex items-center justify-center rounded-[12px] font-serif-text underline active:no-underline hover:cursor-pointer text-xl font-normal bg-red-500",
			},
			size: {
				default: "h-9 px-4 py-3",
				sm: "h-8 rounded-sm px-3 text-xs",
				lg: "h-10 rounded-sm px-8",
				icon: "h-9 w-9 rounded-sm p-0 aspect-square",
				bigIcon: "p-3 aspect-square",
				lifted: "p-2",
				link: "rounded-[12px] font-serif-text underline active:no-underline hover:cursor-pointer text-xl font-normal",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export { buttonVariants };
