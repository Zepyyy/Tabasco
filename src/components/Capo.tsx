import { useCapo } from "@/hooks/useCapo";
import { Input } from "./ui/input";

export default function Capo() {
	const { capo, HandleSetCapos } = useCapo();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (value === "") {
			HandleSetCapos(-1);
			return;
		}
		const num = Number.parseInt(value, 10);
		if (!Number.isNaN(num)) {
			const clamped = Math.min(24, Math.max(-1, num));
			HandleSetCapos(clamped);
		}
	};

	return (
		<div className="flex items-center justify-end gap-2 text-tab font-serif-title antialiased md:text-3xl text-2xl sm:text-2xl">
			<p className="text-tab md:text-3xl text-2xl sm:text-2xl">
				{capo !== -1 ? "Capo:" : ""}
			</p>
			<Input
				type="number"
				inputMode="numeric"
				min={-1}
				max={24}
				step={1}
				value={capo === -1 ? "" : capo}
				onChange={(e) => handleChange(e)}
				placeholder="Add capo"
				className="flex font-semibold border-none shadow-none focus-visible:ring-0 py-0 h-fit w-20 md:w-32 md:text-3xl text-2xl sm:text-2xl"
			/>
		</div>
	);
}
