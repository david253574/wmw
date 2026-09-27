"use client";

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BlankApplicationPDF from './BlankApplicationPDF';
import { FileDown } from 'lucide-react';

export default function DownloadBlankFormButton() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button className="flex items-center space-x-2 text-sm uppercase tracking-wider font-semibold text-gray-600 hover:text-black transition-colors">
        <FileDown className="w-4 h-4" />
        <span>Loading PDF...</span>
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<BlankApplicationPDF />}
      fileName="WME_Access_Card_Application_Form.pdf"
      className="flex items-center space-x-2 text-sm uppercase tracking-wider font-semibold text-gray-600 hover:text-black transition-colors"
    >
      {({ loading }) => (
        <>
          <FileDown className="w-4 h-4" />
          <span>{loading ? 'Preparing Document...' : 'Download Blank Form'}</span>
        </>
      )}
    </PDFDownloadLink>
  );
}
