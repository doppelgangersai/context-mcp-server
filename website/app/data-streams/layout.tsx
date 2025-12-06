import { DataStreamsNavbar } from "@/components/DataStreamsNavbar";
import { Footer } from "@/components/Footer";

export default function DataStreamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DataStreamsNavbar />
      {children}
      <Footer />
    </>
  );
}
