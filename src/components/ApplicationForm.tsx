"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import SignatureCanvas from "react-signature-canvas";
import { Upload, Camera, ShieldAlert, Check, X, ChevronRight, ChevronLeft, Edit2 } from "lucide-react";
import dynamic from "next/dynamic";

const DownloadBlankFormButton = dynamic(
  () => import("./DownloadBlankFormButton"),
  { ssr: false }
);

const formSchema = z.object({
  legalName: z.string().min(2, "Required"),
  preferredName: z.string().optional(),
  dob: z.string().min(1, "Required"),
  gender: z.string().min(1, "Required"),
  nationality: z.string().min(1, "Required"),
  phone: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(1, "Required"),
  idType: z.string().min(1, "Required"),
  idNumber: z.string().min(1, "Required"),
  emergencyName: z.string().min(1, "Required"),
  emergencyRelation: z.string().min(1, "Required"),
  emergencyPhone: z.string().min(1, "Required"),
  fanClubAffiliation: z.string().optional(),
  favoriteMovie: z.string().optional(),
  accessLevel: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof formSchema>;

const STEPS = ["Personal", "Identity", "Organization", "Emergency", "Review"];

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [signatureError, setSignatureError] = useState(false);
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [idDocPreview, setIdDocPreview] = useState<string | null>(null);
  
  const { register, handleSubmit, trigger, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessLevel: "All-Access VIP Bundle",
      idType: "Passport"
    }
  });

  const formData = watch();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (val: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) fieldsToValidate = ['legalName', 'preferredName', 'dob', 'gender', 'nationality', 'phone', 'email', 'address'];
    if (currentStep === 1) fieldsToValidate = ['idType', 'idNumber'];
    if (currentStep === 2) fieldsToValidate = ['fanClubAffiliation', 'favoriteMovie', 'accessLevel'];
    if (currentStep === 3) fieldsToValidate = ['emergencyName', 'emergencyRelation', 'emergencyPhone'];
    
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: FormValues) => {
    if (sigCanvas.current?.isEmpty()) {
      setSignatureError(true);
      return;
    }
    
    setSubmitting(true);
    setError("");

    try {
      const signatureUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');

      const payload = {
        ...data,
        signatureUrl,
        photoUrl: photoPreview,
        idDocumentUrl: idDocPreview,
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit application");

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setSignatureError(false);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-4 md:p-8 font-inter mt-10">
        <div className="bg-black text-white p-8 md:p-12 text-center border-4 border-double border-gray-700 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
          <ShieldAlert className="w-20 h-20 mx-auto text-green-500 mb-6" />
          <h2 className="text-3xl font-black uppercase tracking-widest mb-4">Transmission Secure</h2>
          <p className="text-gray-400 font-mono text-sm leading-relaxed mb-8">
            Dossier encrypted and transmitted to WME Security Operations. 
            Await further instructions. Your unique tracking hash has been logged.
          </p>
          <div className="text-xs text-gray-500 font-mono border-t border-gray-800 pt-8 mt-4">
            STATUS: <span className="text-green-500">PENDING ADJUDICATION</span><br/>
            CLEARANCE: <span className="text-yellow-500">LEVEL 4 REQ</span>
          </div>
        </div>
      </div>
    );
  }

  const inputClasses = "w-full p-3 md:p-4 border-2 border-gray-300 bg-gray-50 focus:bg-white focus:ring-0 focus:border-black font-medium transition-colors text-sm md:text-base rounded-none outline-none";
  const labelClasses = "block text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-500 mb-2";
  const errorClasses = "text-red-500 text-xs font-bold mt-1 uppercase";

  return (
    <div className="min-h-screen bg-gray-100 py-6 md:py-12 px-4 font-inter relative overflow-x-hidden">
      {/* Background Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.03] overflow-hidden">
        <span className="text-[100px] md:text-[200px] font-black tracking-widest transform -rotate-45 whitespace-nowrap">CLASSIFIED</span>
      </div>

      <div className="max-w-4xl mx-auto bg-white shadow-2xl relative z-10 border border-gray-200">
        {/* Header */}
        <header className="bg-black text-white p-6 md:p-10 flex flex-col items-center text-center relative border-b-4 border-red-700">
          <ShieldAlert className="w-10 h-10 md:w-12 md:h-12 mb-4 text-gray-300" />
          <h1 className="text-2xl md:text-4xl font-black tracking-[0.2em] uppercase mb-2">WME Security</h1>
          <p className="text-[#888888] text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-bold">Background Check & Credentialing Form</p>
        </header>

        {/* Progress Tracker - Mobile Optimized */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-4 md:px-8 overflow-x-auto no-scrollbar">
          <div className="flex justify-between items-center min-w-[300px]">
            {STEPS.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1 relative">
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold z-10 transition-colors duration-300 ${
                  index < currentStep ? 'bg-black text-white' : 
                  index === currentStep ? 'bg-red-700 text-white ring-4 ring-red-100' : 
                  'bg-gray-300 text-gray-500'
                }`}>
                  {index < currentStep ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : index + 1}
                </div>
                <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-wider mt-2 text-center absolute top-8 md:top-10 w-20 md:w-24 -ml-10 md:-ml-12 left-1/2 ${
                  index <= currentStep ? 'text-black' : 'text-gray-400'
                }`}>
                  {step}
                </span>
                {/* Connecting Lines */}
                {index < STEPS.length - 1 && (
                  <div className={`absolute top-3 md:top-4 left-1/2 w-full h-[2px] -z-0 ${
                    index < currentStep ? 'bg-black' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 border-l-4 border-red-700 text-sm font-bold mx-6 mt-6 uppercase flex items-center gap-2">
            <X className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* FORM CONTENT */}
        <div className="p-6 md:p-12 pb-24 md:pb-32">
          
          {/* STEP 1: PERSONAL INFO */}
          <div className={currentStep === 0 ? "block" : "hidden"}>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-3 mb-8">1. Personal Identity</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="md:col-span-2">
                <label className={labelClasses}>Full Legal Name *</label>
                <input type="text" {...register("legalName")} className={inputClasses} placeholder="As it appears on Gov ID" />
                {errors.legalName && <p className={errorClasses}>{errors.legalName.message}</p>}
              </div>

              <div>
                <label className={labelClasses}>Preferred Name / Alias</label>
                <input type="text" {...register("preferredName")} className={inputClasses} />
              </div>

              <div>
                <label className={labelClasses}>Date of Birth *</label>
                <input type="date" {...register("dob")} className={inputClasses} />
                {errors.dob && <p className={errorClasses}>{errors.dob.message}</p>}
              </div>

              <div>
                <label className={labelClasses}>Gender *</label>
                <select {...register("gender")} className={inputClasses}>
                  <option value="">SELECT...</option>
                  <option value="Male">MALE</option>
                  <option value="Female">FEMALE</option>
                  <option value="Non-binary">NON-BINARY</option>
                  <option value="Prefer not to say">UNDISCLOSED</option>
                </select>
                {errors.gender && <p className={errorClasses}>{errors.gender.message}</p>}
              </div>

              <div>
                <label className={labelClasses}>Nationality *</label>
                <input type="text" {...register("nationality")} className={inputClasses} />
                {errors.nationality && <p className={errorClasses}>{errors.nationality.message}</p>}
              </div>

              <div>
                <label className={labelClasses}>Primary Phone *</label>
                <input type="tel" {...register("phone")} className={inputClasses} placeholder="+1 (555) 000-0000" />
                {errors.phone && <p className={errorClasses}>{errors.phone.message}</p>}
              </div>

              <div>
                <label className={labelClasses}>Secure Email *</label>
                <input type="email" {...register("email")} className={inputClasses} placeholder="agent@domain.com" />
                {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={labelClasses}>Current Physical Address *</label>
                <textarea {...register("address")} rows={3} className={inputClasses} placeholder="Full street address, city, postal code, country" />
                {errors.address && <p className={errorClasses}>{errors.address.message}</p>}
              </div>
            </div>
          </div>

          {/* STEP 2: IDENTIFICATION */}
          <div className={currentStep === 1 ? "block" : "hidden"}>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-3 mb-8">2. Verification Documents</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
              <div>
                <label className={labelClasses}>Government ID Type *</label>
                <select {...register("idType")} className={inputClasses}>
                  <option value="Passport">PASSPORT</option>
                  <option value="Drivers License">DRIVER'S LICENSE</option>
                  <option value="National ID">NATIONAL ID CARD</option>
                </select>
                {errors.idType && <p className={errorClasses}>{errors.idType.message}</p>}
              </div>
              
              <div>
                <label className={labelClasses}>ID Number *</label>
                <input type="text" {...register("idNumber")} className={inputClasses} />
                {errors.idNumber && <p className={errorClasses}>{errors.idNumber.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Photo Upload */}
              <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center bg-gray-50 relative group">
                <label className={labelClasses}>Applicant Photograph</label>
                <p className="text-[10px] text-gray-400 mb-4">Clear, front-facing headshot on solid background.</p>
                
                {photoPreview ? (
                  <div className="relative w-32 h-40 bg-gray-200 border-2 border-black shadow-lg">
                    <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                    <button type="button" onClick={() => setPhotoPreview(null)} className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-40 bg-white border-2 border-gray-200 hover:border-black transition group-hover:bg-gray-100">
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-xs font-bold uppercase">Select Photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setPhotoPreview)} />
                  </label>
                )}
              </div>

              {/* ID Document Upload */}
              <div className="border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center text-center bg-gray-50 relative group">
                <label className={labelClasses}>Scan of Government ID</label>
                <p className="text-[10px] text-gray-400 mb-4">High-resolution scan of selected ID document.</p>
                
                {idDocPreview ? (
                  <div className="relative w-full max-w-[200px] h-32 bg-gray-200 border-2 border-black shadow-lg">
                    <img src={idDocPreview} className="w-full h-full object-cover" alt="ID Preview" />
                    <button type="button" onClick={() => setIdDocPreview(null)} className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-1 shadow-lg hover:bg-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center w-full h-32 bg-white border-2 border-gray-200 hover:border-black transition group-hover:bg-gray-100">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-xs font-bold uppercase">Select Document</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setIdDocPreview)} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* STEP 3: ORGANIZATION */}
          <div className={currentStep === 2 ? "block" : "hidden"}>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-3 mb-8">3. Authorization Parameters</h3>
            
            <div className="grid grid-cols-1 gap-6 md:gap-8">
              <div>
                <label className={labelClasses}>Requested Access Package *</label>
                <div className="bg-white border-2 border-gray-300 relative cursor-pointer hover:border-black transition overflow-hidden">
                  <div className="absolute top-0 right-0 bg-red-700 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-sm z-10">SELECTED</div>
                  <label className="flex items-start p-4 md:p-6 cursor-pointer relative z-0">
                    <input type="radio" value="All-Access VIP Bundle" {...register("accessLevel")} className="w-5 h-5 text-black focus:ring-black mt-1 shrink-0" defaultChecked />
                    <div className="ml-4">
                      <div className="flex flex-wrap items-baseline gap-2 md:gap-3 mb-2">
                        <span className="font-black text-lg md:text-xl uppercase tracking-widest text-black">All-Access VIP Bundle</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 line-through text-sm font-mono">$8,550</span>
                          <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded">$3,000 USD</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 uppercase tracking-wider font-bold">Comprehensive Clearance Authorization</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono text-gray-500 bg-gray-50 p-4 border border-gray-200">
                        <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-600 shrink-0"/> Perimeter Access (Zone 1)</li>
                        <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-600 shrink-0"/> Basecamp & Catering (Zone 2)</li>
                        <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-600 shrink-0"/> Inner Circle / VIP Tent (Zone 3)</li>
                        <li className="flex items-center gap-2"><Check className="w-3 h-3 text-green-600 shrink-0"/> Direct Meet & Greet (Priority)</li>
                      </ul>
                    </div>
                  </label>
                </div>
                {errors.accessLevel && <p className={errorClasses}>{errors.accessLevel.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className={labelClasses}>Fan Club Affiliation</label>
                  <input type="text" {...register("fanClubAffiliation")} className={inputClasses} placeholder="If applicable" />
                </div>
                <div>
                  <label className={labelClasses}>Favorite KR Work</label>
                  <input type="text" {...register("favoriteMovie")} className={inputClasses} placeholder="Security question basis" />
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: EMERGENCY CONTACT */}
          <div className={currentStep === 3 ? "block" : "hidden"}>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-3 mb-8">4. Emergency Designation</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 mb-8 text-xs font-mono text-yellow-800 uppercase leading-relaxed">
              <strong>Notice:</strong> In the event of a security incident or medical emergency, the following individual will be contacted immediately.
            </div>

            <div className="grid grid-cols-1 gap-6 md:gap-8">
              <div>
                <label className={labelClasses}>Contact Full Name *</label>
                <input type="text" {...register("emergencyName")} className={inputClasses} />
                {errors.emergencyName && <p className={errorClasses}>{errors.emergencyName.message}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <label className={labelClasses}>Relationship *</label>
                  <input type="text" {...register("emergencyRelation")} className={inputClasses} placeholder="e.g. Spouse, Sibling" />
                  {errors.emergencyRelation && <p className={errorClasses}>{errors.emergencyRelation.message}</p>}
                </div>
                <div>
                  <label className={labelClasses}>Emergency Phone *</label>
                  <input type="tel" {...register("emergencyPhone")} className={inputClasses} />
                  {errors.emergencyPhone && <p className={errorClasses}>{errors.emergencyPhone.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 5: REVIEW & SIGN */}
          <div className={currentStep === 4 ? "block" : "hidden"}>
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-3 mb-6 flex justify-between items-end">
              <span>5. Final Adjudication</span>
              <button type="button" onClick={() => setCurrentStep(0)} className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 normal-case font-bold"><Edit2 className="w-3 h-3"/> Edit All</button>
            </h3>
            
            {/* Mobile-Friendly Summary Box */}
            <div className="bg-gray-50 border border-gray-300 p-4 md:p-6 mb-8 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase font-bold">Applicant</span>
                  <p className="font-mono font-bold uppercase truncate">{formData.legalName}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase font-bold">Clearance Level</span>
                  <p className="font-mono font-bold text-red-700 uppercase truncate">{formData.accessLevel}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-500 uppercase font-bold">Gov ID</span>
                  <p className="font-mono uppercase truncate">{formData.idType} - {formData.idNumber}</p>
                </div>
                <div className="flex gap-4 items-center pt-2">
                  <div className="w-12 h-12 bg-gray-200 border border-gray-400 overflow-hidden shrink-0">
                    {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover"/> : <span className="text-[8px] text-center p-2 text-gray-400 block">NO PHOTO</span>}
                  </div>
                  <div className="w-16 h-12 bg-gray-200 border border-gray-400 overflow-hidden shrink-0">
                    {idDocPreview ? <img src={idDocPreview} className="w-full h-full object-cover"/> : <span className="text-[8px] text-center p-2 text-gray-400 block">NO ID DOC</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Legal Attestation */}
            <div className="bg-white border-2 border-gray-300 p-5 md:p-8 relative mb-8">
              <p className="text-[10px] md:text-xs text-gray-700 leading-loose text-justify font-mono">
                By executing this document, I hereby certify under penalty of perjury (pursuant to WME Security Directive 404.1 and applicable Federal statutes including 18 U.S.C. § 1001) that the information provided herein is true, accurate, and complete to the best of my knowledge. I acknowledge that the issued access credentials remain the exclusive property of WME and are subject to immediate revocation without notice. I agree to surrender all credentials upon request or upon the termination of my affiliation with WME. I further consent to continuous background verification and biometric retention as required by WME Security Operations. Falsification of any data will result in immediate permanent disqualification and potential civil or criminal prosecution.
              </p>
            </div>
            
            {/* Signature Area - Strictly Responsive */}
            <div className="mb-8">
              <label className="block text-xs font-black uppercase tracking-widest text-black mb-3 border-l-4 border-red-700 pl-3">Electronic Signature Required</label>
              <div className={`bg-white border-2 relative overflow-hidden rounded ${signatureError ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-300'}`}>
                <div className="absolute top-2 left-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 pointer-events-none z-10">Sign Here x</div>
                {/* The wrapping div ensures the canvas conforms to 100% width on mobile */}
                <div className="w-full h-48 sm:h-56 bg-gray-50/50">
                  <SignatureCanvas 
                    ref={sigCanvas}
                    penColor="#000000"
                    canvasProps={{
                      className: "w-full h-full cursor-crosshair touch-none"
                    }} 
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button type="button" onClick={clearSignature} className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-red-600 transition p-2">
                  [ Clear Signature ]
                </button>
              </div>
              {signatureError && <p className="text-red-500 text-xs font-bold uppercase mt-1">Signature is required to proceed.</p>}
            </div>
          </div>
          
        </div>

        {/* BOTTOM NAVIGATION BAR - Sticky on Mobile */}
        <div className="fixed md:absolute bottom-0 left-0 w-full bg-white border-t-2 border-gray-200 p-4 md:p-6 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:shadow-none flex flex-row justify-between items-center gap-4">
          
          <div className="flex-1">
            {currentStep > 0 && (
              <button 
                type="button" 
                onClick={handlePrev}
                className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 border-2 border-gray-300 text-gray-600 font-bold uppercase text-xs tracking-wider hover:bg-gray-50 transition"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>
          
          <div className="flex-1 flex justify-end">
            {currentStep < 4 ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition shadow-lg"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleSubmit(onSubmit)}
                disabled={submitting}
                className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-red-700 text-white font-black uppercase text-xs tracking-widest hover:bg-red-800 transition shadow-lg disabled:bg-gray-400"
              >
                {submitting ? "Transmitting..." : "Submit Application"}
              </button>
            )}
          </div>
        </div>

        {/* Download Manual Form Link - Only visible on step 1 on desktop */}
        {currentStep === 0 && (
          <div className="hidden md:flex justify-center p-6 border-t border-gray-100 mb-20">
            <DownloadBlankFormButton />
          </div>
        )}
      </div>
    </div>
  );
}
