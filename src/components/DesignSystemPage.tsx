import { CheckCircle2, LayoutGrid, Sparkles } from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import Tag from "./Tag";

const tokenDefinitions = [
	{ key: "background", label: "Background" },
	{ key: "background-light", label: "Background Light" },
	{ key: "foreground", label: "Foreground" },
	{ key: "shadow", label: "Shadow" },
	{ key: "primary", label: "Primary" },
	{ key: "primary-foreground", label: "Primary Foreground" },
	{ key: "secondary", label: "Secondary" },
	{ key: "accent", label: "Accent" },
	{ key: "accent-foreground", label: "Accent Foreground" },
	{ key: "muted", label: "Muted" },
	{ key: "muted-foreground", label: "Muted Foreground" },
	{ key: "tab", label: "Tab" },
	{ key: "tab-subtle", label: "Tab Subtle" },
	{ key: "destructive", label: "Destructive" },
	{ key: "destructive-foreground", label: "Destructive Foreground" },
	{ key: "soft", label: "Soft" },
	{ key: "soft-foreground", label: "Soft Foreground" },
	{ key: "border", label: "Border" },
	{ key: "input", label: "Input" },
	{ key: "ring", label: "Ring" },
	{ key: "tag", label: "Tag" },
];

type TokenMap = Record<string, string>;

const fallbackTokens: TokenMap = Object.fromEntries(
	tokenDefinitions.map(({ key }) => [key, "0 0% 0%"]),
);

const readTokensFromRoot = () => {
	if (typeof window === "undefined") return fallbackTokens;
	const styles = getComputedStyle(document.documentElement);
	return tokenDefinitions.reduce<TokenMap>((acc, { key }) => {
		const value = styles.getPropertyValue(`--${key}`).trim();
		acc[key] = value || fallbackTokens[key];
		return acc;
	}, {});
};

const buildPreviewStyle = (tokens: TokenMap, radius: number) => {
	const style: Record<string, string> = {};
	for (const [key, value] of Object.entries(tokens)) {
		style[`--${key}`] = value;
	}
	style["--radius"] = `${radius}rem`;
	return style as CSSProperties;
};

export default function DesignSystemPage() {
	const { theme } = useTheme();
	const [tokens, setTokens] = useState<TokenMap>(() => readTokensFromRoot());
	const [defaults, setDefaults] = useState<TokenMap>(() =>
		readTokensFromRoot(),
	);
	const [radius, setRadius] = useState<number>(0.25);
	const [isDirty, setIsDirty] = useState(false);

	useEffect(() => {
		const nextDefaults = readTokensFromRoot();
		setDefaults(nextDefaults);
		if (!isDirty) {
			setTokens(nextDefaults);
		}
	}, [theme, isDirty]);

	const previewStyle = useMemo(
		() => buildPreviewStyle(tokens, radius),
		[tokens, radius],
	);

	const handleTokenChange = (key: string, value: string) => {
		setIsDirty(true);
		setTokens((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleReset = () => {
		setTokens(defaults);
		setRadius(0.25);
		setIsDirty(false);
	};

	return (
		<div
			className="min-h-screen bg-background text-foreground"
			style={previewStyle}
		>
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
				<header className="flex flex-col gap-6">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div className="flex flex-col gap-2">
							<p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
								Design System
							</p>
							<h1 className="text-4xl font-serif-title text-tab">
								Tabasco UI Playground
							</h1>
							<p className="max-w-xl text-base text-muted-foreground">
								Tune the core tokens and preview how components feel together.
								Changes stay on this page so you can iterate safely.
							</p>
						</div>
						<div className="flex items-center gap-3">
							<Button variant="outline" size="sm" asChild>
								<Link to="/sheet/0">Back to app</Link>
							</Button>
							<div className="rounded-lg border border-tab bg-background-light p-1">
								<ThemeSwitcher />
							</div>
						</div>
					</div>
					<div className="grid gap-4 rounded-2xl border border-tab bg-background-light/70 p-6 shadow-sm sm:grid-cols-[2fr,1fr]">
						<div className="flex flex-col gap-4">
							<h2 className="text-xl font-semibold">Token Controls</h2>
							<p className="text-sm text-muted-foreground">
								Adjust HSL tokens using the format{" "}
								<span className="font-mono">240 4% 20%</span>. Updates apply
								live to the preview below.
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-3 sm:justify-end">
							<Button variant="outline" size="sm" onClick={handleReset}>
								Reset to theme
							</Button>
							<div className="flex items-center gap-2">
								<Label
									htmlFor="radius"
									className="text-xs text-muted-foreground"
								>
									Radius
								</Label>
								<Input
									id="radius"
									type="number"
									min={0}
									max={1}
									step={0.05}
									value={radius}
									onChange={(event) => {
										setIsDirty(true);
										setRadius(Number(event.target.value));
									}}
									className="w-24"
								/>
							</div>
						</div>
					</div>
				</header>

				<section className="grid gap-4 md:grid-cols-2">
					{tokenDefinitions.map(({ key, label }) => (
						<div
							key={key}
							className="flex items-center justify-between gap-4 rounded-xl border border-tab bg-background-light p-4"
						>
							<div className="flex items-center gap-3">
								<div
									className="h-10 w-10 rounded-lg border border-tab"
									style={{ backgroundColor: `hsl(${tokens[key]})` }}
								/>
								<div className="flex flex-col">
									<span className="text-sm font-semibold">{label}</span>
									<span className="text-xs text-muted-foreground">--{key}</span>
								</div>
							</div>
							<Input
								value={tokens[key]}
								onChange={(event) => handleTokenChange(key, event.target.value)}
								className="max-w-45 font-mono text-xs"
							/>
						</div>
					))}
				</section>

				<section className="grid gap-6 rounded-2xl border border-tab bg-background-light p-6">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<h2 className="text-2xl font-semibold">Typography</h2>
							<p className="text-sm text-muted-foreground">
								Live type samples using the current token palette.
							</p>
						</div>
						<div className="flex items-center gap-3 text-sm text-muted-foreground">
							<LayoutGrid className="h-4 w-4" />
							<span>Grid baseline 8px</span>
						</div>
					</div>
					<div className="grid gap-6 md:grid-cols-[1.5fr,1fr]">
						<div className="flex flex-col gap-4">
							<h3 className="text-4xl font-serif-title text-tab">
								Luminous chords
							</h3>
							<p className="text-base font-serif-text text-tab">
								Balance vintage warmth with crisp readability. This body style
								uses the serif text stack and tokenized contrast.
							</p>
							<p className="text-sm text-muted-foreground">
								Helper copy keeps rhythm and spacing aligned with the new
								palette.
							</p>
						</div>
						<div className="grid gap-3">
							<div className="rounded-xl border border-tab bg-background p-4">
								<p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
									Label
								</p>
								<p className="text-lg font-semibold">Section Header</p>
								<p className="text-sm text-muted-foreground">
									Supporting details
								</p>
							</div>
							<div className="rounded-xl border border-tab bg-background p-4">
								<p className="text-sm">
									Body text with emphasis on clarity and flow.
								</p>
								<p className="text-xs text-muted-foreground">
									Caption microcopy
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="grid gap-6 rounded-2xl border border-tab bg-background-light p-6">
					<h2 className="text-2xl font-semibold">Components</h2>
					<div className="grid gap-6 lg:grid-cols-2">
						<div className="flex flex-col gap-4 rounded-xl border border-tab bg-background p-5">
							<h3 className="text-lg font-semibold">Buttons</h3>
							<div className="flex flex-wrap gap-3">
								<Button>Default</Button>
								<Button variant="deep">Deep</Button>
								<Button variant="outline">Outline</Button>
								<Button variant="soft">Soft</Button>
								<Button variant="destructive">Destructive</Button>
								<Button variant="link">link</Button>
								<Button variant="transparent">transparent</Button>
							</div>
							<div className="flex flex-wrap items-center gap-3">
								<Button size="sm">Small</Button>
								<Button size="default">Default</Button>
								<Button size="lg">Large</Button>
								<Button size="icon">★</Button>
								<Button size="bigIcon" variant="deep">
									<Sparkles className="h-4 w-4" />
								</Button>
								<Button size="lifted" lifted>
									Lifted
								</Button>
							</div>
						</div>

						<div className="flex flex-col gap-4 rounded-xl border border-tab bg-background p-5">
							<h3 className="text-lg font-semibold">Inputs</h3>
							<div className="grid gap-3">
								<div className="grid gap-2">
									<Label htmlFor="system-input">Label</Label>
									<Input id="system-input" placeholder="Type here" />
								</div>
								<div className="grid gap-2">
									<Label htmlFor="system-select">Select</Label>
									<Select>
										<SelectTrigger id="system-select">
											<SelectValue placeholder="Pick a mode" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="classic">Classic</SelectItem>
											<SelectItem value="modern">Modern</SelectItem>
											<SelectItem value="lofi">Lo-fi</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
					</div>

					<div className="grid gap-6 lg:grid-cols-2">
						<div className="flex flex-col gap-4 rounded-xl border border-tab bg-background p-5">
							<h3 className="text-lg font-semibold">Feedback</h3>
							<Alert>
								<CheckCircle2 className="h-4 w-4" />
								<AlertTitle>Saved to library</AlertTitle>
								<AlertDescription>
									Your tabs have been safely stored.
								</AlertDescription>
							</Alert>
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="outline">Open dialog</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Reset arrangement?</AlertDialogTitle>
										<AlertDialogDescription>
											This clears the current layout and restores defaults.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction>Confirm</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>

						<div className="flex flex-col gap-4 rounded-xl border border-tab bg-background p-5">
							<h3 className="text-lg font-semibold">Menus</h3>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">Open menu</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-48">
									<DropdownMenuLabel>Workspace</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem>Duplicate tab</DropdownMenuItem>
									<DropdownMenuItem>Export</DropdownMenuItem>
									<DropdownMenuItem className="text-destructive-foreground">
										Remove
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
							<div className="rounded-lg border border-tab bg-background-light p-4">
								<p className="text-sm text-muted-foreground">
									Use this section to validate surfaces, shadows, and menu
									spacing across themes.
								</p>
							</div>
						</div>
					</div>
				</section>

				<section className="grid gap-4 rounded-2xl border border-tab bg-background-light p-6">
					<h2 className="text-2xl font-semibold">Preview Card</h2>
					<div className="grid gap-4 md:grid-cols-[2fr,1fr]">
						<div className="rounded-2xl border border-tab bg-background p-6 shadow-sm">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
										Now playing
									</p>
									<h3 className="text-2xl font-semibold">Midnight Strum</h3>
									<p className="text-sm text-muted-foreground">
										Tempo 92 • Key of C
									</p>
								</div>
								<Button variant="deep">Play</Button>
							</div>
							<div className="mt-4 flex flex-wrap gap-2">
								<Tag>Fingerstyle</Tag>
								<Tag>Jazz</Tag>
								<Tag>Studio</Tag>
								<Tag>Loop 4x</Tag>
							</div>
							<div className="mt-6 grid gap-3">
								<div className="flex items-center justify-between">
									<span className="text-sm text-muted-foreground">
										Progress
									</span>
									<span className="text-sm font-semibold">65%</span>
								</div>
								<div className="h-2 rounded-full bg-tab-subtle">
									<div
										className="h-full rounded-full bg-primary"
										style={{ width: "65%" }}
									/>
								</div>
							</div>
						</div>
						<div className="flex flex-col gap-3 rounded-2xl border border-tab bg-background p-5">
							<p className="text-sm font-semibold">System checklist</p>
							<ul className="space-y-2 text-sm text-muted-foreground">
								<li className="flex items-center gap-2">
									<span className={cn("h-2 w-2 rounded-full bg-primary")} />
									Contrast passed
								</li>
								<li className="flex items-center gap-2">
									<span className={cn("h-2 w-2 rounded-full bg-secondary")} />
									Focus ring visible
								</li>
								<li className="flex items-center gap-2">
									<span className={cn("h-2 w-2 rounded-full bg-accent")} />
									Icons consistent
								</li>
							</ul>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
