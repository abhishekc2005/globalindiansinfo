import {
  ImportantLinksBrowser,
  ImportantLink,
} from "@/components/resources/important-links-browser";

async function getImportantLinks(): Promise<ImportantLink[]> {
  try {
    const res = await fetch(
      "https://server.globalindiansinfo.com/api/important-links",
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch links: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching important links:", error);
    return [];
  }
}

export default async function ResourcesPage() {
  const importantLinks = await getImportantLinks();

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <ImportantLinksBrowser initialLinks={importantLinks} />
      </div>
    </main>
  );
}
