"use client";

import { useEffect, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import AccessCardPDF from "@/components/AccessCardPDF";
import { useParams } from "next/navigation";

export default function PDFPreviewPage() {
  const params = useParams();
  const id = params?.id as string;
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (id) {
      fetch(`/api/admin/applications/${id}`)
        .then(res => res.json())
        .then(data => {
          setApplication(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (!isClient) return null; // Avoid SSR issues with react-pdf

  if (loading) {
    return <div className="p-8 text-center">Loading PDF...</div>;
  }

  if (!application) {
    return <div className="p-8 text-center text-red-500">Application not found</div>;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">
      <div className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">WME - Access Card Preview</h1>
        <PDFDownloadLink 
          document={<AccessCardPDF application={application} />} 
          fileName={`WME_Access_Card_${application.legalName.replace(/\s+/g, '_')}.pdf`}
          className="bg-white text-black px-4 py-2 text-sm font-semibold hover:bg-gray-200 transition"
        >
          {({ loading }) => (loading ? "Generating..." : "Download PDF")}
        </PDFDownloadLink>
      </div>
      <div className="flex-1">
        <PDFViewer className="w-full h-full border-none">
          <AccessCardPDF application={application} />
        </PDFViewer>
      </div>
    </div>
  );
}
