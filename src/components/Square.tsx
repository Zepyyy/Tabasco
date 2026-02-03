export default function Square({
	children,
	wide,
	img,
	svg,
	onClick,
	onMouseDown,
	className,
}: {
	children: React.ReactNode;
	wide?: boolean;
	img?: string;
	svg?: React.ReactNode;
	onClick?: () => void;
	onMouseDown?: () => void;
	className?: string;
}) {
	return (
		<div
			className={`flex h-15 ${wide ? "w-full" : img ? "w-fit" : "min-w-15 w-15 aspect-square"} px-4 items-center justify-center border-y even:border-r odd:border-r border-foreground last:border-foreground first:border-l last:border-b bg-background cursor-pointer overflow-hidden ${className}`}
			onClick={() => onClick && onClick()}
			onMouseDown={() => onMouseDown && onMouseDown()}
		>
			<div className="flex justify-center items-center px-4 gap-2">
				{img ? (
					<img src={img} alt="Square Image" className="flex w-10 h-10" />
				) : null}
				{svg ? svg : <div className="flex gap-4">{children}</div>}
			</div>
		</div>
	);
}
