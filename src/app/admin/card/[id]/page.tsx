"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DigitalCardPDF from "@/components/DigitalCardPDF";
import { useParams } from "next/navigation";
import { ArrowLeft, RefreshCw, Download } from "lucide-react";
import Link from "next/link";

export default function CardEditorPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [originalData, setOriginalData] = useState<any>(null);
  const [cardData, setCardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [cardState, setCardState] = useState<"Draft" | "Pending" | "Approved" | "Expired">("Draft");

  useEffect(() => {
    setIsClient(true);
    if (id) {
      fetch(`/api/admin/applications/${id}`)
        .then(res => res.json())
        .then(data => {
          // Map some initial fallback values if role/dept don't exist
          const enrichedData = {
            ...data,
            role: data.role || "MEMBER",
            department: data.department || data.fanClubAffiliation || "GENERAL",
          };
          setOriginalData(enrichedData);
          setCardData(enrichedData);
          setCardState(data.status === "APPROVED" ? "Approved" : "Pending");
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
    return <div className="p-8 text-center text-gray-500 min-h-screen flex items-center justify-center">Loading Organizational Editor...</div>;
  }

  if (!cardData) {
    return <div className="p-8 text-center text-red-500 min-h-screen">Application not found</div>;
  }

  const handleReset = () => {
    setCardData(originalData);
    setCardState(originalData.status === "APPROVED" ? "Approved" : "Pending");
  };

  const getAccentColor = () => {
    switch (cardState) {
      case "Approved": return "#10B981"; // Emerald
      case "Pending": return "#F59E0B";  // Amber
      case "Expired": return "#EF4444";  // Red
      case "Draft":
      default: return "#6B7280";         // Gray
    }
  };

  const handleChange = (field: string, value: string) => {
    setCardData({ ...cardData, [field]: value });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 font-inter">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-black transition flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-xl font-bold text-gray-800">Organizational ID Prototype Editor</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition border border-gray-300">
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          
          <PDFDownloadLink 
            document={<DigitalCardPDF application={cardData} accentColor={getAccentColor()} />} 
            fileName={`Org_Prototype_${cardData.legalName.replace(/\s+/g, '_')}.pdf`}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 text-sm font-semibold hover:bg-blue-700 transition rounded-md shadow-sm"
          >
            {({ loading }) => (loading ? "Generating..." : <><Download className="w-4 h-4"/> Download Preview PDF</>)}
          </PDFDownloadLink>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: EDITOR */}
        <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Prototype Configuration</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Card State</label>
              <select 
                value={cardState}
                onChange={(e) => setCardState(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Pending">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Cardholder Name</label>
              <input 
                type="text" 
                value={cardData.cardHolderName || cardData.legalName || ""} 
                onChange={e => handleChange("cardHolderName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Role</label>
                <input 
                  type="text" 
                  value={cardData.role || ""} 
                  onChange={e => handleChange("role", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Department</label>
                <input 
                  type="text" 
                  value={cardData.department || ""} 
                  onChange={e => handleChange("department", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Access Category</label>
              <input 
                type="text" 
                value={cardData.accessLevel || ""} 
                onChange={e => handleChange("accessLevel", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Reference Number</label>
              <input 
                type="text" 
                value={cardData.cardNumber || ""} 
                onChange={e => handleChange("cardNumber", e.target.value)}
                placeholder="PENDING"
                className="w-full p-2 border border-gray-300 rounded font-mono text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Issue Date</label>
                <input 
                  type="date" 
                  value={cardData.issueDate ? new Date(cardData.issueDate).toISOString().split('T')[0] : ""} 
                  onChange={e => handleChange("issueDate", e.target.value ? new Date(e.target.value).toISOString() : "")}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Expiration Date</label>
                <input 
                  type="date" 
                  value={cardData.expiryDate ? new Date(cardData.expiryDate).toISOString().split('T')[0] : ""} 
                  onChange={e => handleChange("expiryDate", e.target.value ? new Date(e.target.value).toISOString() : "")}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Note about Photo updating */}
            <div className="bg-blue-50 p-3 rounded border border-blue-100 mt-4">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Photograph and foundational data are pulled directly from the applicant's submitted file and cannot be altered in this prototype viewer.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW */}
        <div className="w-full lg:w-2/3 bg-gray-100 p-8 flex flex-col items-center justify-center overflow-y-auto">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-10">Live Web Preview</h2>
          
          {/* HTML/CSS Card Implementation */}
          <div 
            className="relative bg-white rounded-xl shadow-2xl overflow-hidden flex flex-row"
            style={{ width: "486px", height: "306px" }}
          >
            {/* Status Color Bar */}
            <div className="absolute top-0 left-0 bottom-0 w-3 z-20" style={{ backgroundColor: getAccentColor() }}></div>

            {/* PREVIEW Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
              <span className="text-8xl font-black text-black opacity-[0.03] -rotate-30 tracking-widest select-none">PREVIEW</span>
            </div>
            
            {/* Left Photo Column */}
            <div className="w-[35%] h-full pl-6 flex items-center justify-center relative z-20">
              <div className="w-28 h-36 bg-gray-100 border-2 border-gray-200 rounded flex items-center justify-center overflow-hidden">
                {cardData.photoUrl ? (
                  <img src={cardData.photoUrl} alt="Applicant" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-400 font-bold uppercase">No Photo</span>
                )}
              </div>
            </div>

            {/* Right Details Column */}
            <div className="w-[65%] h-full p-6 pl-4 flex flex-col justify-center relative z-20">
              <div className="border-b border-gray-200 pb-2 mb-5">
                <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Organization Identity Prototype</h3>
              </div>
              
              <h2 className="text-2xl font-black text-gray-900 uppercase leading-tight truncate">
                {cardData.cardHolderName || cardData.legalName || "N/A"}
              </h2>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6 truncate">
                {cardData.role || "Member"} • {cardData.department || "General"}
              </p>
              
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Access Category</p>
                  <p className="text-[11px] font-bold text-gray-800">{cardData.accessLevel || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Reference No.</p>
                  <p className="text-[11px] font-bold text-gray-800 font-mono tracking-tight">{cardData.cardNumber || "PENDING"}</p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Issue Date</p>
                  <p className="text-[11px] font-bold text-gray-800">
                    {cardData.issueDate ? new Date(cardData.issueDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Expiration Date</p>
                  <p className="text-[11px] font-bold text-gray-800">
                    {cardData.expiryDate ? new Date(cardData.expiryDate).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center max-w-md">
            <p className="text-xs text-gray-500 leading-relaxed">
              This is a live HTML/CSS preview of the generated card prototype. Adjusting properties in the editor will instantly update this view. Click "Download Preview PDF" to capture the finalized prototype.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
