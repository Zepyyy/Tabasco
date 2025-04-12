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
		<Breadcrumb className="w-full absolute top-0 left-0 pt-12 pl-12 z-20 text-2xl font-serifText">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/">
						<p className="text-2xl font-serifText">...</p>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator>
					<p className="text-2xl font-serifText">/</p>
				</BreadcrumbSeparator>
				<BreadcrumbItem>
					<TabsDropdownMenu />
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
