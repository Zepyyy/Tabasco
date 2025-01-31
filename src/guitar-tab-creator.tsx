"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
const STRINGS = 6;
const FRETS = 12;

export default function GuitarTabCreator() {
    const [tab, setTab] = useState<string[][]>(
        Array(STRINGS)
            .fill(null)
            .map(() => Array(FRETS).fill("-"))
    );

    const handleCellClick = (string: number, fret: number) => {
        const newTab = tab.map((row, i) =>
            row.map((cell, j) =>
                i === string && j === fret
                    ? cell === "-"
                        ? "0"
                        : cell === "0"
                        ? "X"
                        : "-"
                    : cell
            )
        );
        setTab(newTab);
        console.log(string);
    };

    const incrementFretNumber = (string: number, fret: number) => {
        const newTab = [...tab];
        const currentValue = newTab[string][fret];
        switch (true) {
            case currentValue === "-":
                newTab[string][fret] = "1";
                break;
            case currentValue === "X":
                newTab[string][fret] = "-";
                break;
            default: {
                const nextValue = Number.parseInt(currentValue) + 1;
                newTab[string][fret] =
                    nextValue > 24 ? "-" : nextValue.toString();
                break;
            }
        }
        setTab(newTab);
    };

    const clearTab = () => {
        setTab(
            Array(STRINGS)
                .fill(null)
                .map(() => Array(FRETS).fill("-"))
        );
    };

    return (
        <div className="container p-4">
            <div className="mb-4">
                {tab.map((string, i) => (
                    <div key={i} className="flex">
                        {string.map((fret, j) => (
                            <div
                                key={j}
                                className="w-8 h-8 border border-gray-300 flex items-center justify-center cursor-grabbing"
                                onClick={() => incrementFretNumber(i, j)}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    handleCellClick(i, j);
                                }}
                            >
                                {fret}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <Button onClick={clearTab}>Clear Tab</Button>
        </div>
    );
}
