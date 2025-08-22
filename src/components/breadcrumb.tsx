import TabsDropdownMenu from "./TabsDropdownMenu";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";

export default function BreadCrumbs() {
	return (
		<Breadcrumb className="flex flex-col z-20 text-2xl font-serif-title">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/">
						<p className="text-2xl font-serif-title">...</p>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator>
					<p className="text-2xl font-serif-title">/</p>
				</BreadcrumbSeparator>
				<BreadcrumbItem>
					<TabsDropdownMenu />
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
