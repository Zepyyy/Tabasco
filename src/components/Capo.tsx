import { useContext, useEffect } from "react";
import { Input } from "./ui/input";
import { CapoContext } from "@/contexts/CapoContext";
import { Button } from "./ui/button";
import { updateTabCapoByPosition } from "@/db/crud/UpdateTab";
import { useParams } from "react-router";
import { getCapoByPosition } from "@/db/crud/GetTab";
import { MAX_FRET } from "@/types/guitar-tab";

export default function Capo() {
	const { capo, setCapo } = useContext(CapoContext);
	const { tabPositionFromParam } = useParams<{
		tabPositionFromParam: string;
	}>();
	function HandleSetCapo(capo: number) {
		if (capo >= -1 && capo <= MAX_FRET) {
			setCapo(capo);
			updateTabCapoByPosition(tabPositionFromParam || "0", capo);
		}
	}

	useEffect(() => {
		if (tabPositionFromParam) {
			getCapoByPosition(tabPositionFromParam).then((capo) => setCapo(capo));
		}
	}, [capo, setCapo, tabPositionFromParam]);

	return (
		<div className="flex flex-row gap-2 justify-evenly items-center">
			{capo != -1 && capo != undefined ? (
				<div className="flex flex-row gap-2 text-tab font-serif-title antialiased md:text-3xl text-2xl sm:text-2xl w-full">
					<p className="text-tab md:text-3xl text-2xl sm:text-2xl">Capo:</p>
					<Input
						type="text"
						value={capo}
						onChange={(e) => {
							const { value } = e.target;
							const num = parseInt(value, 10);
							if (!isNaN(num)) {
								HandleSetCapo(num);
							} else if (value === "") {
								HandleSetCapo(-1); // No more capo, or invalid
							}
						}}
						placeholder="Enter capo position"
						className="font-semibold border-none shadow-none focus-visible:ring-0 py-0 h-fit w-full md:text-3xl text-2xl sm:text-2xl"
					/>
				</div>
			) : (
				<div className="flex flex-row gap-2 font-serif-title antialiased md:text-3xl text-2xl sm:text-2xl w-full">
					<Button
						variant="transparent"
						size="default"
						className="font-semibold border-none shadow-none focus-visible:ring-0 py-0 h-fit w-1/4 md:text-3xl text-2xl sm:text-2xl"
						onClick={() => {
							HandleSetCapo(1);
							console.log("Capo set to 1");
						}}
					>
						No capo
					</Button>
				</div>
			)}
		</div>
	);
}
