// app/(main-group)/layout.tsx

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="p-6 pt-20">{children}</div>

      {/* Name prompt dialog - will only show if user has no name */}
    </div>
  );
}
