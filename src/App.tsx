import { Input } from "./components/ui/input";
import GuitarTabCreator from "./guitar-tab-creator";

export default function App() {
    return (
        <main className="flex min-h-screen ">
            <div className="flex flex-col justify-start w-full p-24">
                <Input
                    type="text"
                    placeholder="Enter tab name"
                    className="font-bold mb-4 border-none shadow-none focus-visible:ring-0 w-1/6 text-3xl md:text-4xl py-0 h-fit"
                />
                <GuitarTabCreator />
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">
                            Click to increment fret number
                        </p>
                        <p className="text-sm text-gray-600">
                            Right-click to switch note open/mute/off
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
