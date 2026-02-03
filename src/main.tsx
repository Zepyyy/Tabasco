import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import ModernApp from "./ModernApp.tsx";

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<BrowserRouter>
				<Routes>
					{/*<Route path="*" element={<Navigate to="/sheet/0" replace />} />*/}
					<Route path="/sheet">
						<Route path="/sheet/:tabPositionFromParam" element={<App />} />
						<Route
							path="/sheet/modern/:tabPositionFromParam"
							element={<ModernApp />}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</StrictMode>,
	);
}
