import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="*" element={<Navigate to="/sheet/0" replace />} />
				<Route path="/sheet">
					<Route path="/sheet/:tabId" element={<App />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
