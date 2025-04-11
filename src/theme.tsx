import "@mantine/core/styles.css";
import {
	defaultVariantColorsResolver,
	type VariantColorsResolver,
	createTheme,
	type DefaultMantineColor,
	type MantineColorsTuple,
} from "@mantine/core";

import "./App.module.css";

type ExtendedCustomColors = "lacouleur" | DefaultMantineColor;

declare module "@mantine/core" {
	export interface MantineThemeColorsOverride {
		colors: Record<ExtendedCustomColors, MantineColorsTuple>;
	}
}

// C2C3F4
// 464883

const customTheme = createTheme({
	autoContrast: true,
	colors: {
		lacouleur: [
			"#f1f2fd", // 0
			"#e0e1ee", // 1
			"#C2C3F4", // 2 -bfbfda
			"#9b9cc6", // 3 -9b9cc6
			"#7d7eb4", // 4 -7d7eb4
			"#6a6baa", // 5
			"#6062a6", // 6
			"#505292", // 7
			"#464883", // 8
			"#3b3e75", // 9
		],
	},
});

const variantColorResolver: VariantColorsResolver = (button) => {
	// color: MantineColor | undefined;
	// theme: MantineTheme;
	// variant: string;
	// gradient?: MantineGradient;
	// autoContrast?: boolean;
	const defaultResolvedColors = defaultVariantColorsResolver(button);
	// console.log("Button Computed :", button, button.variant);

	switch (button.variant) {
		case "light":
			// switch (button.) {
			return {
				...defaultResolvedColors,
				// color: "var(--mantine-color-blue-9)",
				// hoverColor: customTheme.colors?.lacouleur?.[2] || "",
				// hover: customTheme.colors?.lacouleur?.[7] || "",
				// background: customTheme.colors?.lacouleur?.[6] || "",
				// border: "none",
			};
		case "filled":
			return {
				...defaultResolvedColors,
				// color: "var(--mantine-color-red-9)",
				// hoverColor: customTheme.colors?.lacouleur?.[2] || "",
				// hover: customTheme.colors?.lacouleur?.[7] || "",
				// background: customTheme.colors?.lacouleur?.[6] || "",
				// border: "none",
			};
		case "outline":
			return {
				// color: "var(--mantine-color-green-9)",
				...defaultResolvedColors,
				// hoverColor: customTheme.colors?.lacouleur?.[2] || "",
				// hover: customTheme.colors?.lacouleur?.[7] || "",
				// background: customTheme.colors?.lacouleur?.[6] || "",
				// border: "none",
			};
		case "gradient":
			return {
				// color: "var(--mantine-color-green-9)",
				...defaultResolvedColors,
				// hoverColor: customTheme.colors?.lacouleur?.[2] || "",
				// hover: customTheme.colors?.lacouleur?.[7] || "",
				// background: customTheme.colors?.lacouleur?.[6] || "",
				// border: "none",
			};
		default: {
			return {
				...defaultResolvedColors,
			};
		}
	}
};

// Button Computed : rgb(96, 98, 166) light #6062a6 - 6 filled
// Button Computed : rgb(70, 72, 131) dark #464883 - 8 filled

// Button Computed : rgb(80, 82, 146) light hover #505292 - 7 filled
// Button Computed : rgb(59, 62, 117) dark hover #3b3e75 - 9 filled

// Merge the default theme with the new variant resolver
export const theme = createTheme({
	autoContrast: true,
	colors: {
		lacouleur: customTheme.colors?.lacouleur,
	},
	primaryColor: "lacouleur",
	primaryShade: 8,
	defaultGradient: {
		from: customTheme.colors?.lacouleur?.[5] || "",
		to: customTheme.colors?.lacouleur?.[9] || "",
		deg: 135,
	},
	other: {
		fontWeights: {
			bold: 700,
			extraBold: 900,
		},
	},
	variantColorResolver,
});
