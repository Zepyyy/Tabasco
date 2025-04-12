import GUIDropdownMenu from "./GUI-dropdownMenu";

export default function GUI() {
	return (
		<div className="flex flex-col gap-4 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border border-border">
			<div className="flex gap-2 justify-center items-center">
				<GUIDropdownMenu />
			</div>
		</div>
	);
}
