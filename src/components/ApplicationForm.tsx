"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SignatureCanvas from "react-signature-canvas";
import { Upload, Camera, FileText, ShieldAlert, BadgeCheck, QrCode, Fingerprint } from "lucide-react";
import dynamic from "next/dynamic";

const DownloadBlankFormButton = dynamic(
  () => import("./DownloadBlankFormButton"),
  { ssr: false }
);

// Types and Schema
const formSchema = z.object({
  legalName: z.string().min(2, "Legal name is required"),
  preferredName: z.string().optional(),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().min(1, "Nationality is required"),
  phone: z.string().min(5, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(5, "Address is required"),
  
  idType: z.string().min(1, "ID Type is required"),
  idNumber: z.string().min(1, "ID Number is required"),
  idDocument: z.any().optional(),
  
  fanClubAffiliation: z.string().optional(),
  socialMediaHandle: z.string().optional(),
  favoriteMovie: z.string().optional(),
  accessLevel: z.string().min(1, "Access level is required"),
  
  emergencyName: z.string().min(1, "Emergency contact name is required"),
  emergencyRelation: z.string().min(1, "Relationship is required"),
  emergencyPhone: z.string().min(5, "Emergency phone is required"),
  emergencyEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  
  photo: z.any().optional(),
  cardHolderName: z.string().min(2, "Card holder name is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApplicationForm() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const sigCanvas = useRef<SignatureCanvas>(null);
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessLevel: "All-Access VIP Bundle",
      idType: "Passport"
    }
  });

  const legalName = watch("legalName");
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setError("");
    
    try {
      const signatureUrl = sigCanvas.current?.isEmpty() 
        ? null 
        : sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");

      if (!signatureUrl) {
        setError("Please provide a digital signature.");
        setSubmitting(false);
        return;
      }

      let photoDataUrl = photoPreview;
      let idDocDataUrl = null;
      
      const idDocFile = (document.getElementById("idDocument") as HTMLInputElement)?.files?.[0];
      if (idDocFile) {
        const reader = new FileReader();
        idDocDataUrl = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(idDocFile);
        });
      }

      const payload = {
        ...data,
        signatureUrl,
        photoUrl: photoDataUrl,
        idDocumentUrl: idDocDataUrl,
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit application");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto mt-20 bg-[#faf9f6] border border-gray-300 shadow-xl relative overflow-hidden">
        <div className="bg-black h-2 w-full"></div>
        <div className="p-12 text-center">
          <BadgeCheck className="w-16 h-16 mx-auto mb-6 text-green-700" />
          <h2 className="text-3xl font-playfair mb-4 text-gray-900">Submission Confirmed</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Your secure application has been encrypted and transmitted to the WME Security Operations Center. A designated clearance officer will review your dossier.
          </p>
          <div className="bg-gray-100 border border-gray-200 p-4 mb-8 text-sm font-mono text-gray-500">
            TRANSACTION ID: WME-{Date.now().toString().slice(-8)}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-black text-white px-8 py-3 uppercase tracking-widest text-xs font-semibold hover:bg-gray-800 transition-colors"
          >
            Return to Portal
          </button>
        </div>
      </div>
    );
  }

  const InputWrapper = ({ label, error, children, required = true }: any) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      {children}
      {error && <span className="text-red-600 text-xs mt-1 block font-medium">{error}</span>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-[#fdfbf7] border border-gray-300 shadow-2xl mb-20 relative font-inter overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden z-0">
        <span className="text-[120px] md:text-[200px] font-black tracking-widest transform -rotate-45 whitespace-nowrap">STRICTLY CONFIDENTIAL</span>
      </div>

      {/* Official Top Bar */}
      <div className="bg-black text-white px-8 py-2 flex justify-between items-center text-xs tracking-widest font-mono uppercase relative z-10">
        <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-red-500" /> STRICTLY CONFIDENTIAL</span>
        <span>FORM ID: WME-SEC-0042 | REV: 2026.1</span>
      </div>

      <div className="px-8 py-10 md:px-16 md:py-14 border-b-4 border-double border-gray-300 relative z-10">
        <div className="absolute top-10 right-8 md:right-16 text-right flex flex-col items-end">
          <div className="inline-block border-2 border-red-700 text-red-700 px-3 py-1 font-bold tracking-widest uppercase transform rotate-6 opacity-80 text-xl font-playfair mb-4 bg-white/50 backdrop-blur-sm">
            OFFICIAL USE
          </div>
          <div className="flex flex-col items-center opacity-80">
            <QrCode className="w-10 h-10 text-gray-800 mb-1" />
            <span className="text-[8px] font-mono tracking-widest text-gray-800 font-bold">AUTH-CODE</span>
          </div>
        </div>
        <h1 className="text-5xl font-playfair tracking-tight mb-2 font-black text-black">WME</h1>
        <h2 className="text-lg tracking-widest uppercase font-semibold text-gray-600">Keanu Reeves • VIP Security & Access Control</h2>
        <div className="w-24 h-1 bg-red-700 mt-6"></div>
      </div>
      
      <div className="bg-gray-100 border-b border-gray-300 p-3 px-8 md:px-16 flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-600">APPLICATION DOSSIER</span>
        <DownloadBlankFormButton />
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-16">
        {error && (
          <div className="bg-red-50 text-red-900 p-4 mb-8 border-l-4 border-red-700 font-medium text-sm">
            ERROR: {error}
          </div>
        )}

        <p className="text-sm text-gray-500 mb-12 border-l-2 border-gray-300 pl-4 italic">
          Instructions: Complete all fields in this document accurately. Any falsification of information will result in immediate termination of clearance processing.
        </p>

        {/* Section 1 */}
        <section className="mb-14">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold text-lg font-playfair">I</span>
            <h3 className="text-2xl font-playfair font-bold text-black border-b border-gray-300 pb-1 flex-1">
              Personal Identification
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <InputWrapper label="Full Legal Name" error={errors.legalName?.message}>
              <input {...register("legalName")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors text-lg" placeholder="As it appears on government ID" />
            </InputWrapper>
            <InputWrapper label="Preferred Name" required={false}>
              <input {...register("preferredName")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors text-lg" />
            </InputWrapper>
            
            <InputWrapper label="Date of Birth" error={errors.dob?.message}>
              <input type="date" {...register("dob")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors text-lg" />
            </InputWrapper>
            <InputWrapper label="Gender" error={errors.gender?.message}>
              <select {...register("gender")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors text-lg appearance-none rounded-none">
                <option value="">Select Option...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </InputWrapper>
            
            <InputWrapper label="Nationality" error={errors.nationality?.message}>
              <input {...register("nationality")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors text-lg" />
            </InputWrapper>
            <InputWrapper label="Primary Phone" error={errors.phone?.message}>
              <input {...register("phone")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors text-lg" />
            </InputWrapper>
            
            <div className="md:col-span-2">
              <InputWrapper label="Official Email Address" error={errors.email?.message}>
                <input type="email" {...register("email")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors text-lg" />
              </InputWrapper>
            </div>
            
            <div className="md:col-span-2">
              <InputWrapper label="Current Residential Address" error={errors.address?.message}>
                <textarea {...register("address")} rows={2} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors text-lg resize-none"></textarea>
              </InputWrapper>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mb-14">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold text-lg font-playfair">II</span>
            <h3 className="text-2xl font-playfair font-bold text-black border-b border-gray-300 pb-1 flex-1">
              Government Verification
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-3">ID Document Type *</label>
              <div className="space-y-2 bg-gray-50 p-4 border border-gray-200">
                {["Passport", "National ID", "Driver's License", "Other"].map(type => (
                  <label key={type} className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" value={type} {...register("idType")} className="w-4 h-4 text-black focus:ring-black border-gray-300" />
                    <span className="font-medium">{type}</span>
                  </label>
                ))}
              </div>
              {errors.idType && <span className="text-red-600 text-xs mt-1 block font-medium">{errors.idType.message}</span>}
            </div>
            
            <div className="flex flex-col gap-6">
              <InputWrapper label="Document ID Number" error={errors.idNumber?.message}>
                <input {...register("idNumber")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors text-lg font-mono tracking-wider" />
              </InputWrapper>
              
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-2">Secure Upload (Scan/Photo) *</label>
                <div className="border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 p-6 flex flex-col items-center justify-center cursor-pointer relative transition-colors">
                  <input id="idDocument" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*,.pdf" />
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-600">ATTACH DOCUMENT</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-14">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold text-lg font-playfair">III</span>
            <h3 className="text-2xl font-playfair font-bold text-black border-b border-gray-300 pb-1 flex-1">
              Fan Profile & Access Request
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <InputWrapper label="Fan Club Affiliation (if any)" required={false}>
              <input {...register("fanClubAffiliation")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors text-lg" placeholder="e.g. KR Global Fans" />
            </InputWrapper>
            <InputWrapper label="Social Media Handle" required={false}>
              <input {...register("socialMediaHandle")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors text-lg" placeholder="e.g. @keanufan1" />
            </InputWrapper>
            
            <div className="md:col-span-2">
              <InputWrapper label="Favorite Keanu Reeves Movie" required={false}>
                <input {...register("favoriteMovie")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors text-lg" placeholder="e.g. The Matrix, John Wick" />
              </InputWrapper>
            </div>
            
            <div className="md:col-span-2 mt-4">
              <label className="block text-xs font-bold text-gray-800 uppercase tracking-wide mb-3">VIP Package & Clearance Level *</label>
              <div className="grid grid-cols-1 gap-3">
                <label className="relative border-2 border-gray-200 p-5 cursor-pointer hover:border-black transition-colors bg-white flex flex-col group has-[:checked]:border-black has-[:checked]:bg-gray-50">
                  <input type="radio" value="All-Access VIP Bundle" {...register("accessLevel")} className="absolute right-5 top-5 w-5 h-5 text-black focus:ring-black" />
                  
                  <div className="flex items-center gap-3 mb-3 pr-8">
                    <span className="font-bold text-lg">All-Access VIP Bundle</span>
                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded border border-red-200">BUNDLE DISCOUNT</span>
                  </div>
                  
                  <div className="mb-4 bg-gray-50 p-4 border border-gray-200">
                    <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Package Includes:</div>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center text-sm border-b border-gray-200 pb-1">
                        <div><span className="font-semibold text-gray-800">Perimeter</span> <span className="text-gray-500 text-xs ml-1">(General Set/Event)</span></div>
                        <span className="text-gray-400 line-through font-mono text-xs">$250</span>
                      </li>
                      <li className="flex justify-between items-center text-sm border-b border-gray-200 pb-1">
                        <div><span className="font-semibold text-gray-800">Basecamp</span> <span className="text-gray-500 text-xs ml-1">(Trailers & Crew)</span></div>
                        <span className="text-gray-400 line-through font-mono text-xs">$800</span>
                      </li>
                      <li className="flex justify-between items-center text-sm border-b border-gray-200 pb-1">
                        <div><span className="font-semibold text-gray-800">Inner Circle</span> <span className="text-gray-500 text-xs ml-1">(Direct Proximity)</span></div>
                        <span className="text-gray-400 line-through font-mono text-xs">$2,500</span>
                      </li>
                      <li className="flex justify-between items-center text-sm">
                        <div><span className="font-semibold text-gray-800">Meet & Greet</span> <span className="text-gray-500 text-xs ml-1">(Approved Interaction)</span></div>
                        <span className="text-gray-400 line-through font-mono text-xs">$5,000</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-auto flex items-end justify-between border-t border-gray-200 pt-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Amount Due</span>
                      <span className="text-xs text-gray-400 line-through font-mono">$8,550 Value</span>
                    </div>
                    <span className="font-mono text-3xl font-black text-red-700">$3,000</span>
                  </div>
                </label>
              </div>
              {errors.accessLevel && <span className="text-red-600 text-xs mt-2 block font-medium">{errors.accessLevel.message}</span>}
            </div>
          </div>
        </section>

        {/* Section 4 & 5 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-black text-white w-6 h-6 flex items-center justify-center font-bold text-sm font-playfair">IV</span>
              <h3 className="text-xl font-playfair font-bold text-black border-b border-gray-300 pb-1 flex-1">
                Emergency Contact
              </h3>
            </div>
            <div className="space-y-4">
              <InputWrapper label="Contact Name" error={errors.emergencyName?.message}>
                <input {...register("emergencyName")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors" />
              </InputWrapper>
              <InputWrapper label="Relationship" error={errors.emergencyRelation?.message}>
                <input {...register("emergencyRelation")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors" />
              </InputWrapper>
              <InputWrapper label="Contact Phone" error={errors.emergencyPhone?.message}>
                <input {...register("emergencyPhone")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors" />
              </InputWrapper>
              <InputWrapper label="Contact Email" required={false}>
                <input type="email" {...register("emergencyEmail")} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors" />
              </InputWrapper>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-black text-white w-6 h-6 flex items-center justify-center font-bold text-sm font-playfair">V</span>
              <h3 className="text-xl font-playfair font-bold text-black border-b border-gray-300 pb-1 flex-1">
                Badge Data
              </h3>
            </div>
            
            <div className="bg-white border border-gray-300 p-6 shadow-inner">
              <div className="flex gap-6 items-start">
                <div className="w-32 h-40 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group cursor-pointer shrink-0">
                  <input type="file" onChange={handlePhotoChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" />
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2">
                      <Camera className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Required<br/>Headshot</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs font-bold">REPLACE</div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <InputWrapper label="Badge Display Name" error={errors.cardHolderName?.message}>
                    <input {...register("cardHolderName")} defaultValue={legalName} className="w-full border-b-2 border-gray-300 bg-transparent py-2 focus:border-black focus:outline-none transition-colors font-bold uppercase" placeholder="e.g. JOHN D." />
                  </InputWrapper>
                  <div className="p-3 bg-gray-50 border border-gray-200 text-xs text-gray-600">
                    Photo must be recent, forward-facing, on a neutral background, with no hats or sunglasses.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Section 6 */}
        <section className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold text-lg font-playfair">VI</span>
            <h3 className="text-2xl font-playfair font-bold text-black border-b border-gray-300 pb-1 flex-1">
              Attestation & Authorization
            </h3>
          </div>
          
          <div className="bg-gray-50 border border-gray-300 p-6 md:p-8 relative z-10">
            <p className="text-xs text-gray-700 mb-6 leading-relaxed text-justify font-mono">
              By executing this document, I hereby certify under penalty of perjury (pursuant to WME Security Directive 404.1) that the information provided herein is true, accurate, and complete to the best of my knowledge. I acknowledge that the issued access credentials remain the exclusive property of WME and are subject to immediate revocation without notice. I agree to surrender all credentials upon request or upon the termination of my affiliation with WME. I further consent to standard background verification procedures as required by WME Security Operations. Falsification of any data will result in immediate permanent disqualification.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="bg-white border-2 border-gray-300 relative">
                  <div className="absolute top-2 left-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 pointer-events-none">Sign Here x</div>
                  <SignatureCanvas 
                    ref={sigCanvas}
                    penColor="#000080"
                    canvasProps={{className: "w-full h-40 cursor-crosshair"}} 
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Digital Signature Capture Area</span>
                  <button 
                    type="button" 
                    onClick={() => sigCanvas.current?.clear()}
                    className="text-xs font-bold text-red-600 hover:text-red-800 uppercase"
                  >
                    Clear Signature
                  </button>
                </div>
              </div>
              
              <div className="w-full md:w-48 shrink-0">
                <div className="bg-white border-2 border-dashed border-gray-300 h-40 flex flex-col items-center justify-center text-gray-400 relative group cursor-not-allowed">
                  <Fingerprint className="w-16 h-16 mb-2 opacity-50" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-center px-4">Biometric Scan<br/>(In-Person Only)</span>
                  <div className="absolute inset-0 bg-gray-50/50 hidden group-hover:flex items-center justify-center">
                    <span className="text-[10px] font-bold text-red-700 bg-white px-2 py-1 border border-red-700">WME AGENT VERIFIED</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 block text-center">Thumbprint Box</span>
              </div>
            </div>
          </div>
        </section>

        {/* Official Use Only Block */}
        <div className="mt-12 bg-gray-200 p-2 border-4 border-black border-double opacity-80 pointer-events-none grayscale">
          <div className="bg-white border-2 border-black p-6">
            <h4 className="text-center font-black tracking-widest uppercase text-xl mb-1">Do Not Fill</h4>
            <p className="text-center text-[10px] font-bold text-red-700 tracking-widest uppercase mb-6">For WME Adjudication Officer Use Only</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-b-2 border-dashed border-gray-400 pb-6 relative">
                <span className="absolute bottom-1 left-0 text-[10px] uppercase font-bold text-gray-500">Approving Officer ID</span>
              </div>
              <div className="border-b-2 border-dashed border-gray-400 pb-6 relative">
                <span className="absolute bottom-1 left-0 text-[10px] uppercase font-bold text-gray-500">Clearance Status</span>
              </div>
              <div className="border-b-2 border-dashed border-gray-400 pb-6 relative">
                <span className="absolute bottom-1 left-0 text-[10px] uppercase font-bold text-gray-500">Timestamp (UTC)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t-4 border-double border-gray-300 mt-12 flex justify-between items-end">
          <div className="hidden md:block text-[10px] font-mono text-gray-400 uppercase">
            // END OF DOSSIER // EYES ONLY // WME-SEC
          </div>
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full md:w-auto bg-red-700 text-white px-12 py-5 uppercase tracking-widest font-black text-sm hover:bg-red-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
          >
            {submitting ? "Transmitting..." : "Submit Official Record"}
          </button>
        </div>
      </form>
    </div>
  );
}
