import { Slot } from "@radix-ui/react-slot";
import { VariantProps } from "class-variance-authority";
import * as React from "react";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { cn } from "@/lib/utils";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    lifted?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, lifted = false, children, disabled, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		const baseClassName = cn(buttonVariants({ variant, size, className }));

		if (!lifted) {
			return (
				<Comp className={baseClassName} ref={ref} {...props}>
					{children}
				</Comp>
			);
		}

		return (
			<div className={cn("relative inline-block", !disabled && "group")}>
				<span className={cn(baseClassName, "invisible pointer-events-none")}>
					{children}
				</span>
				<span
					aria-hidden="true"
					className={cn(
						baseClassName,
						"absolute left-1.5 top-1.5 pointer-events-none bg-shadow text-white",
					)}
				>
					{children}
				</span>
				<Comp
					className={cn(
						baseClassName,
						"absolute left-0 top-0 transition-all duration-150",
						!disabled && "group-hover:left-1 group-hover:top-1",
					)}
					ref={ref}
					disabled={disabled}
					{...props}
				>
					{children}
				</Comp>
			</div>
		);
	},
);
Button.displayName = "Button";

export { Button };
