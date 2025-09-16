import SettingsDropdownMenu from "./SettingsDropdownMenu";

export default function Gui() {
	return (
		<div className="flex flex-col gap-4 rounded-lg">
			<div className="flex gap-2 justify-center items-center">
				<SettingsDropdownMenu />
			</div>
		</div>
	);
}
