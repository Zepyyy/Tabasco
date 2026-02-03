import { useCapo } from "@/hooks/useCapo";
import { Input } from "./ui/input";

export default function Capo() {
	const { capo, HandleSetCapos } = useCapo();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		const num = Number.parseInt(value, 10);
		if (!Number.isNaN(num)) {
			HandleSetCapos(num);
		} else if (value === "") {
			HandleSetCapos(-1); // No more capo, or invalid
		}
	};

	return (
		<div className="flex flex-row justify-end! items-center text-tab font-serif-title antialiased md:text-3xl text-2xl sm:text-2xl w-full gap-2">
			<p className="flex justify-end! text-tab md:text-3xl text-2xl sm:text-2xl w-full">
				{capo !== -1 ? "Capo:" : ""}
			</p>
			<Input
				type="text"
				value={capo === -1 ? "" : capo}
				onChange={(e) => handleChange(e)}
				placeholder="Add capo"
				className="flex font-semibold border-none shadow-none focus-visible:ring-0 py-0 h-fit w-full md:text-3xl text-2xl sm:text-2xl"
			/>
		</div>
	);
}
