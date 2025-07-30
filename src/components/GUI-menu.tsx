import GUIDropdownMenu from "./GUI-dropdownMenu";

export default function GUI() {
	return (
		<div className="flex flex-col gap-4 rounded-lg">
			<div className="flex gap-2 justify-center items-center">
				<GUIDropdownMenu />
			</div>
		</div>
	);
}
