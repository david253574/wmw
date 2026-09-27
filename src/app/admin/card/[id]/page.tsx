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
          const enrichedData = {
            ...data,
            role: data.role || "VIP GUEST",
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
    return <div className="p-8 text-center text-gray-500 min-h-screen flex items-center justify-center">Loading Credential Editor...</div>;
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
      case "Approved": return "#00E676"; // Neon Green
      case "Pending": return "#FFEA00";  // Neon Yellow
      case "Expired": return "#FF1744";  // Neon Red
      case "Draft":
      default: return "#2979FF";         // Neon Blue
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
          <h1 className="text-xl font-bold text-gray-800">WME VIP Credential Engine</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition border border-gray-300">
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          
          <PDFDownloadLink 
            document={<DigitalCardPDF application={cardData} accentColor={getAccentColor()} />} 
            fileName={`WME_VIP_Access_${cardData.legalName?.replace(/\s+/g, '_') || 'Card'}.pdf`}
            className="flex items-center gap-2 bg-black text-white px-5 py-2 text-sm font-semibold hover:bg-gray-800 transition rounded-md shadow-sm"
          >
            {({ loading }) => (loading ? "Generating..." : <><Download className="w-4 h-4"/> Export Print-Ready Card</>)}
          </PDFDownloadLink>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: EDITOR */}
        <div className="w-full lg:w-1/3 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-2">Credential Configuration</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Authorization State</label>
              <select 
                value={cardState}
                onChange={(e) => setCardState(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black"
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
                className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black uppercase font-bold"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Role</label>
                <input 
                  type="text" 
                  value={cardData.role || ""} 
                  onChange={e => handleChange("role", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Department</label>
                <input 
                  type="text" 
                  value={cardData.department || ""} 
                  onChange={e => handleChange("department", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Clearance Level</label>
              <input 
                type="text" 
                value={cardData.accessLevel || ""} 
                onChange={e => handleChange("accessLevel", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-black focus:border-black uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Reference Number</label>
              <input 
                type="text" 
                value={cardData.cardNumber || ""} 
                onChange={e => handleChange("cardNumber", e.target.value)}
                placeholder="PENDING"
                className="w-full p-2 border border-gray-300 rounded font-mono text-sm focus:ring-black focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Issue Date</label>
                <input 
                  type="date" 
                  value={cardData.issueDate ? new Date(cardData.issueDate).toISOString().split('T')[0] : ""} 
                  onChange={e => handleChange("issueDate", e.target.value ? new Date(e.target.value).toISOString() : "")}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Expiration Date</label>
                <input 
                  type="date" 
                  value={cardData.expiryDate ? new Date(cardData.expiryDate).toISOString().split('T')[0] : ""} 
                  onChange={e => handleChange("expiryDate", e.target.value ? new Date(e.target.value).toISOString() : "")}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-black focus:border-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW */}
        <div className="w-full lg:w-2/3 bg-[#111111] p-8 flex flex-col items-center justify-center overflow-y-auto">
          
          {/* Authentic Tactical ID Badge Preview */}
          <div 
            className="relative bg-[#050505] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col border border-gray-800"
            style={{ width: "306px", height: "486px" }}
          >
            {/* Header */}
            <div className="h-[70px] bg-[#111111] flex flex-row items-center px-5 border-b-[3px]" style={{ borderColor: getAccentColor() }}>
              <div className="flex-1">
                <h1 className="text-white text-lg font-bold tracking-[2px]">WME SECURITY</h1>
                <p className="text-[#888888] text-[7px] tracking-[2px] mt-1 uppercase">Global Access Credential</p>
              </div>
              <div className="w-8 h-8 rounded-full opacity-80" style={{ backgroundColor: getAccentColor() }}></div>
            </div>

            {/* Microtext side */}
            <div className="absolute top-[90px] -left-[40px] -rotate-90 origin-top-left">
              <span className="text-[#222222] text-[5px] tracking-[2px] font-mono">
                AUTH-HASH: {cardData.id || '000000000000'} // DO NOT DUPLICATE
              </span>
            </div>

            {/* Photo */}
            <div className="flex justify-center mt-6 relative z-10">
              <div className="w-[140px] h-[175px] border-2 border-[#333333] bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
                {cardData.photoUrl ? (
                  <img src={cardData.photoUrl} alt="Applicant" className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-500" />
                ) : (
                  <span className="text-[10px] text-[#444] font-bold uppercase">No Photo</span>
                )}
              </div>
            </div>

            {/* Identity */}
            <div className="flex flex-col items-center mt-4 px-5">
              <h2 className="text-white text-[22px] font-bold uppercase text-center leading-tight">
                {cardData.cardHolderName || cardData.legalName || "N/A"}
              </h2>
              <p className="text-[#AAAAAA] text-[10px] uppercase tracking-[1.5px] mt-1">
                {cardData.role || "VIP GUEST"}
              </p>
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-2 gap-y-3 mt-5 px-6">
              <div>
                <p className="text-[6px] text-[#666666] uppercase tracking-[1px] mb-0.5">Clearance Level</p>
                <p className="text-[9px] font-bold uppercase" style={{ color: getAccentColor() }}>{cardData.accessLevel || "STANDARD"}</p>
              </div>
              <div>
                <p className="text-[6px] text-[#666666] uppercase tracking-[1px] mb-0.5">Department</p>
                <p className="text-[9px] text-[#E0E0E0] font-bold uppercase">{cardData.department || "GENERAL"}</p>
              </div>
              <div>
                <p className="text-[6px] text-[#666666] uppercase tracking-[1px] mb-0.5">Issued</p>
                <p className="text-[9px] text-[#E0E0E0] font-bold uppercase">
                  {cardData.issueDate ? new Date(cardData.issueDate).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[6px] text-[#666666] uppercase tracking-[1px] mb-0.5">Expires</p>
                <p className="text-[9px] text-[#E0E0E0] font-bold uppercase">
                  {cardData.expiryDate ? new Date(cardData.expiryDate).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>

            {/* Barcode Footer */}
            <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center">
              <div className="flex flex-row h-6 mb-1 opacity-80">
                {[4,1,2,1,4,1,1,2,4,1,1,4,2,1,1,4,2,1,4,1,2,1,4].map((width, i) => (
                  <div key={i} className="bg-white h-full mr-[1.5px]" style={{ width: `${width}px` }}></div>
                ))}
              </div>
              <p className="text-white text-[10px] tracking-[3px] font-mono">
                {cardData.cardNumber || "PENDING"}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
