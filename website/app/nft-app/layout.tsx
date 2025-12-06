import { NftSidebar } from "@/components/NftSidebar";

export default function NftAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <NftSidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}

