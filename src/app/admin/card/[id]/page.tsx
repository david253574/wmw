"use client";

import { useEffect, useState } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import DigitalCardPDF from "@/components/DigitalCardPDF";
import { useParams } from "next/navigation";

export default function CardPreviewPage() {
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

  if (!isClient) return null;

  if (loading) {
    return <div className="p-8 text-center text-white bg-black min-h-screen">Loading Digital Card...</div>;
  }

  if (!application) {
    return <div className="p-8 text-center text-red-500 bg-black min-h-screen">Application not found</div>;
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-900">
      <div className="bg-black text-white p-4 flex justify-between items-center border-b border-gray-800">
        <h1 className="text-xl font-bold font-playfair tracking-wider">WME - Digital ID Card</h1>
        <PDFDownloadLink 
          document={<DigitalCardPDF application={application} />} 
          fileName={`WME_Access_Card_${application.legalName.replace(/\s+/g, '_')}.pdf`}
          className="bg-red-700 text-white px-6 py-2 text-sm font-semibold hover:bg-red-800 transition rounded"
        >
          {({ loading }) => (loading ? "Generating..." : "Download ID Card")}
        </PDFDownloadLink>
      </div>
      <div className="flex-1 p-8 flex justify-center items-center">
        {/* We use a specific max-width container to preview the small card properly */}
        <div className="w-full max-w-sm h-[600px] shadow-2xl shadow-red-900/20">
          <PDFViewer className="w-full h-full border-none rounded-xl overflow-hidden" showToolbar={false}>
            <DigitalCardPDF application={application} />
          </PDFViewer>
        </div>
      </div>
    </div>
  );
}
