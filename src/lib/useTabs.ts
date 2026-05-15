import { db } from "@/db/db";
import { TabInfo } from "@/types/guitar-tab";

export async function getAllTabs(): Promise<TabInfo[]> {
	return await db.TabInfo.toArray();
}
