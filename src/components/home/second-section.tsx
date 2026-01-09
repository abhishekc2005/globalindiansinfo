import { Button } from "../ui/button";
import { SectionLayout } from "./section-layout";
import { HighlightSection } from "./highlight-section";
import { formatUniversalDate } from "@/utils/date";
import { useRouter } from "next/navigation";

export default function SecondSection({ items }: { items: any[] }) {
  const router = useRouter();
  const formattedItems = items?.map((item) => ({
    ...item,
    publishedAt: formatUniversalDate(item.publishedAt),
  }));

  console.log(formattedItems);

  return (
    <SectionLayout
      title="GLOBAL INDIAN | COVER STORIES"
      subtitle="Stories that are researched and written by our editorial team"
      showSeparator
      center={true}
    >
      <HighlightSection items={formattedItems} />
      <div>
        <Button
          variant="outline"
          className="mx-auto mt-8 block cursor-pointer rounded-full px-8"
          onClick={() => router.push("/category")}
        >
          View All Stories
        </Button>
      </div>
    </SectionLayout>
  );
}
