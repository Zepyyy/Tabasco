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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Guitar Tab Creator</h1>
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
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-600">
                        Click to increment fret number
                    </p>
                    <p className="text-sm text-gray-600">
                        Right-click to switch note open/mute/off
                    </p>
                </div>
                <Button onClick={clearTab}>Clear Tab</Button>
            </div>
        </div>
    );
}
