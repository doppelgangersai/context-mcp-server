import { DeveloperSidebar } from "@/components/DeveloperSidebar";

export default function DeveloperAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <DeveloperSidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}


