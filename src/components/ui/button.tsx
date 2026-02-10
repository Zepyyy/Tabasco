import { Slot } from "@radix-ui/react-slot";
import { VariantProps } from "class-variance-authority";
import * as React from "react";
import { buttonVariants } from "@/components/ui/buttonVariants";
import { cn } from "@/lib/utils";
import { Tooltip } from "../LiftedButton";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	lifted?: boolean;
	tooltip?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			lifted = false,
			tooltip,
			children,
			disabled,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		const baseClassName = cn(buttonVariants({ variant, size, className }));

		if (!lifted) {
			return (
				<div className={"relative inline-block w-fit self-start group/tooltip"}>
					{tooltip && <Tooltip className="mt-0">{tooltip}</Tooltip>}
					<Comp className={baseClassName} ref={ref} {...props}>
						{children}
					</Comp>
				</div>
			);
		}

		return (
			<div
				className={cn(
					"relative inline-block w-fit self-start group/tooltip",
					!disabled && "group",
				)}
			>
				{tooltip && <Tooltip className="mt-1">{tooltip}</Tooltip>}
				<span className={cn(baseClassName, "invisible pointer-events-none")}>
					{children}
				</span>
				<span
					aria-hidden="true"
					className={cn(
						baseClassName,
						"absolute left-1.5 top-1.5 pointer-events-none bg-shadow text-white border-none",
					)}
				>
					{children}
				</span>
				<Comp
					className={cn(
						baseClassName,
						"absolute left-0 top-0 transition-colors duration-150",
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
