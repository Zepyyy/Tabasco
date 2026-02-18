import { cva } from "class-variance-authority";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-colors duration-150 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-1 border-border-400 hover:border-transparent bg-background-light text-foreground",
	{
		variants: {
			variant: {
				default:
					"bg-background text-primary border-2 border-secondary dark:bg-background dark:text-primary-foreground hover:border-transparent hover:bg-secondary",
				deep: "bg-primary text-primary-foreground border-none hover:border-transparent hover:bg-primary/80",
				destructive:
					"hover:bg-danger-000 hover:text-danger-900 text-danger-000 border-none bg-background hover:border-transparent",
				soft: "bg-background text-foreground hover:bg-background-light border-none hover:border-none",
				outline:
					"bg-background text-primary border-2 border-secondary dark:bg-background dark:text-primary-foreground hover:border-transparent hover:bg-primary/20",
				transparent:
					"text-foreground border-none shadow-none inset-shadow-none active:shadow-none active:inset-shadow-none",
				link: "bg-background text-foreground border-none shadow-none inset-shadow-none active:shadow-none active:inset-shadow-none font-serif-text underline active:no-underline hover:underline-offset-3 transition-opacity duration-100 hover:cursor-pointer text-xl font-normal",
			},
			size: {
				default: "h-9 px-4 py-3",
				sm: "h-8 rounded-lg px-3 text-xs",
				lg: "h-10 rounded-lg px-8",
				icon: "h-9 w-9 rounded-lg p-0 aspect-square",
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
