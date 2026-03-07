export default function Tag({ children }: { children: React.ReactNode }) {
	return (
		<span className="rounded-md bg-tag px-3 py-1 text-xs text-tab">
			{children}
		</span>
	);
}
