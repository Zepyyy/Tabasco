import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Dropdownmenu from "./Dropdownmenu";

export default function BreadCrumbs() {
	return (
		<Breadcrumb className="w-full absolute top-0 left-0 pt-12 pl-12 z-20 text-xl font-serifTitle">
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="/">
						<p className="text-xl font-serifTitle">...</p>
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator>
					<p className="text-xl font-serifTitle">/</p>
				</BreadcrumbSeparator>
				<BreadcrumbItem>
					<Dropdownmenu />
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
