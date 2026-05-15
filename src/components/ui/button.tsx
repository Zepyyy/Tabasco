import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./buttonVariants"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

		return (
			<div
				className={cn(
					"relative inline-block w-fit self-start group/tooltip",
					!disabled && "group",
				)}
			>
				{tooltip && (
					<Tooltip
						side={tooltipSide}
						className={clsx(
							tooltipSide == "top" ? "mb-0.5! ml-1!" : "",
							tooltipSide == "bottom" ? "mt-2.5! ml-1!" : "",
							tooltipSide == "left" ? "mr-0.5! mt-1!" : "",
							tooltipSide == "right" ? "ml-2.5! mt-1!" : "",
						)}
					>
						{tooltip}
					</Tooltip>
				)}
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
