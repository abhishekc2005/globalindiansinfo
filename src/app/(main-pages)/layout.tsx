// app/(main-group)/layout.tsx
import { NamePromptDialog } from "@/app/(main-pages)/_components/new-dialog-prompt";
import { Footer } from "@/components/layout/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="p-4 md:p-6 min-h-screen pt-20 md:pt-24">{children}</div>

      {/* Name prompt dialog - will only show if user has no name */}
      <NamePromptDialog />
      {/* <Footer/> */}
    </div>
  );
}
