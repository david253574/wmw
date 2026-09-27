import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#000',
    backgroundColor: '#FFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 10,
  },
  topBarText: {
    fontFamily: 'Courier-Bold',
    fontSize: 8,
    letterSpacing: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  titleBlock: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 22,
    fontFamily: 'Times-Bold',
    letterSpacing: 1,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  subTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#333',
  },
  stampBox: {
    borderWidth: 2,
    borderColor: '#000',
    padding: 5,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampText: {
    fontFamily: 'Times-Bold',
    fontSize: 14,
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stampSub: {
    fontSize: 6,
    fontFamily: 'Courier',
    marginTop: 2,
  },
  instructionBox: {
    backgroundColor: '#EBEBEB',
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#999',
  },
  instructionText: {
    fontSize: 7,
    fontFamily: 'Times-Italic',
    lineHeight: 1.3,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    backgroundColor: '#000',
    color: '#FFF',
    padding: 4,
    paddingLeft: 8,
    marginTop: 10,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  boxField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    padding: 4,
    marginRight: -1, 
    marginBottom: -1, 
    minHeight: 28,
  },
  boxFieldDouble: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#000',
    padding: 4,
    marginRight: -1,
    marginBottom: -1,
    minHeight: 28,
  },
  boxLabel: {
    fontSize: 6,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    color: '#555',
    marginBottom: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 3,
  },
  checkbox: {
    width: 8,
    height: 8,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 3,
  },
  checkboxText: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
  },
  photoBox: {
    width: 80,
    height: 100,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  photoText: {
    fontSize: 7,
    color: '#999',
    textAlign: 'center',
    padding: 5,
    fontFamily: 'Courier',
  },
  legalText: {
    fontSize: 7,
    fontFamily: 'Times-Roman',
    lineHeight: 1.3,
    textAlign: 'justify',
    marginBottom: 8,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 25,
    marginTop: 10,
  },
  officeUseBox: {
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#000',
    padding: 8,
  },
  officeUseTitle: {
    fontFamily: 'Courier-Bold',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
  },
  footerText: {
    fontSize: 6,
    fontFamily: 'Courier',
    color: '#666',
  },
  watermark: {
    position: 'absolute',
    top: 300,
    left: 40,
    opacity: 0.05,
    transform: 'rotate(-45deg)',
    zIndex: -1,
  },
  watermarkText: {
    fontSize: 70,
    fontFamily: 'Helvetica-Bold',
    color: '#000',
    textAlign: 'center',
  },
  barcodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 15,
    marginTop: 2,
  },
  barThin: { width: 1, height: '100%', backgroundColor: '#000', marginRight: 1 },
  barThick: { width: 3, height: '100%', backgroundColor: '#000', marginRight: 1 },
  barMedium: { width: 2, height: '100%', backgroundColor: '#000', marginRight: 1 },
});

export const BlankApplicationPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Background Watermark */}
      <View style={styles.watermark}>
        <Text style={styles.watermarkText}>STRICTLY</Text>
        <Text style={styles.watermarkText}>CONFIDENTIAL</Text>
      </View>

      {/* Top Bar for Official Look */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>WME-SEC-FRM-0042</Text>
        <Text style={styles.topBarText}>REV: 2026.1 / KR-VIP</Text>
        <Text style={styles.topBarText}>PAGE 1 OF 2</Text>
      </View>

      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.mainTitle}>WME Security Ops</Text>
          <Text style={styles.subTitle}>Keanu Reeves • VIP / Fan Access Clearance Form</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <View style={styles.stampBox}>
            <Text style={styles.stampText}>Confidential</Text>
            <Text style={styles.stampSub}>DO NOT DUPLICATE</Text>
          </View>
          <View style={styles.barcodeBox}>
            <View style={styles.barThin} /><View style={styles.barThick} /><View style={styles.barThin} />
            <View style={styles.barMedium} /><View style={styles.barThin} /><View style={styles.barThick} />
            <View style={styles.barThin} /><View style={styles.barThick} /><View style={styles.barMedium} />
            <View style={styles.barThin} /><View style={styles.barThin} /><View style={styles.barThick} />
            <View style={styles.barThin} />
          </View>
          <Text style={{ fontSize: 6, fontFamily: 'Courier', marginTop: 2 }}>AUTH-CODE</Text>
        </View>
      </View>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>
          INSTRUCTIONS: Print legibly in black or blue ink. Do not write in the shaded areas. Falsification of any information on this document will result in immediate denial of clearance and placement on the Restricted Watchlist. All applicants are subject to thorough background verification by WME/KR Security.
        </Text>
      </View>

      {/* Section 1 */}
      <View style={styles.sectionTitle}><Text>Section I: Personal Identification Subject Data</Text></View>
      <View style={styles.row}>
        <View style={styles.boxFieldDouble}>
          <Text style={styles.boxLabel}>1. Full Legal Name (As it appears on Govt ID)</Text>
        </View>
        <View style={styles.boxField}>
          <Text style={styles.boxLabel}>2. Preferred Name / Alias</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.boxField}>
          <Text style={styles.boxLabel}>3. Date of Birth (MM/DD/YYYY)</Text>
        </View>
        <View style={styles.boxField}>
          <Text style={styles.boxLabel}>4. Biological/Identified Gender</Text>
        </View>
        <View style={styles.boxField}>
          <Text style={styles.boxLabel}>5. Nationality / Citizenship</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.boxField}>
          <Text style={styles.boxLabel}>6. Primary Contact Number</Text>
        </View>
        <View style={styles.boxFieldDouble}>
          <Text style={styles.boxLabel}>7. Official Email Address</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={[styles.boxFieldDouble, { minHeight: 40 }]}>
          <Text style={styles.boxLabel}>8. Current Permanent Residential Address (Include Postal Code)</Text>
        </View>
      </View>

      {/* Section 2 */}
      <View style={styles.sectionTitle}><Text>Section II: Government Verification</Text></View>
      <View style={styles.row}>
        <View style={styles.boxField}>
          <Text style={styles.boxLabel}>9. Identification Type Provided</Text>
          <View style={styles.checkboxRow}>
            <View style={styles.checkboxItem}><View style={styles.checkbox}></View><Text style={styles.checkboxText}>Passport</Text></View>
            <View style={styles.checkboxItem}><View style={styles.checkbox}></View><Text style={styles.checkboxText}>Nat. ID</Text></View>
            <View style={styles.checkboxItem}><View style={styles.checkbox}></View><Text style={styles.checkboxText}>Driver's License</Text></View>
          </View>
        </View>
        <View style={styles.boxField}>
          <Text style={styles.boxLabel}>10. Document ID Number</Text>
        </View>
      </View>
      <Text style={{ fontSize: 7, fontFamily: 'Times-Italic', marginBottom: 5 }}>
        * A clear, unredacted photocopy of the identification document MUST be stapled to the back of this form.
      </Text>

      {/* Section 3 */}
      <View style={styles.sectionTitle}><Text>Section III: Fan Profile & Subject Background</Text></View>
      <View style={styles.row}>
        <View style={styles.boxField}>
          <Text style={styles.boxLabel}>11. Verified Fan Club Affiliation (If Applicable)</Text>
        </View>
        <View style={styles.boxField}>
          <Text style={styles.boxLabel}>12. Primary Social Media Handle (For Vetting)</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.boxFieldDouble}>
          <Text style={styles.boxLabel}>13. Favorite KR Cinematic Work (Security Question)</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.boxFieldDouble}>
          <Text style={styles.boxLabel}>14. Requested VIP Package / Clearance Level</Text>
          <View style={{ marginTop: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <View style={styles.checkbox}></View>
              <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold' }}>All-Access VIP Bundle ($3,000)</Text>
              <Text style={{ fontSize: 7, marginLeft: 4 }}>Total Value: $8,550</Text>
            </View>
            <View style={{ marginLeft: 11 }}>
              <Text style={{ fontSize: 7, marginBottom: 1 }}>Package Includes: Perimeter ($250), Basecamp ($800), Inner Circle ($2,500), Meet & Greet ($5,000)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Section 4 */}
      <View style={styles.sectionTitle}><Text>Section IV: Emergency Contact Information</Text></View>
      <View style={styles.row}>
        <View style={styles.boxField}><Text style={styles.boxLabel}>15. Full Legal Name</Text></View>
        <View style={styles.boxField}><Text style={styles.boxLabel}>16. Relationship to Subject</Text></View>
      </View>
      <View style={styles.row}>
        <View style={styles.boxField}><Text style={styles.boxLabel}>17. Contact Phone Number</Text></View>
        <View style={styles.boxField}><Text style={styles.boxLabel}>18. Contact Email Address</Text></View>
      </View>

      {/* Section 5 & 6 Container */}
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        
        <View style={{ marginRight: 15 }}>
          <View style={styles.photoBox}>
            <Text style={styles.photoText}>STAPLE RECENT 2x2 HEADSHOT HERE</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 9, fontFamily: 'Times-Bold', textTransform: 'uppercase', marginBottom: 5 }}>
            Section V: Attestation & Authorization
          </Text>
          <Text style={styles.legalText}>
            By executing this document, I certify under penalty of perjury (pursuant to WME Security Directive 404.1) that all information provided herein is true, accurate, and voluntarily given. I explicitly consent to WME and KR Security Operations conducting comprehensive background checks, including but not limited to open-source intelligence gathering and social media audits. Falsification of any data will result in immediate permanent disqualification.
          </Text>
          <Text style={styles.legalText}>
            I acknowledge that any issued access credentials remain the exclusive property of WME and are subject to immediate revocation without cause or notice. I agree to strictly adhere to all physical and digital security protocols while inside restricted zones.
          </Text>
          
          <View style={styles.row}>
            <View style={{ flex: 2, marginRight: 10 }}>
              <View style={styles.signatureLine} />
              <Text style={styles.boxLabel}>Subject Signature</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.signatureLine} />
              <Text style={styles.boxLabel}>Date</Text>
            </View>
          </View>
        </View>

      </View>

      {/* Office Use Only */}
      <View style={styles.officeUseBox}>
        <Text style={styles.officeUseTitle}>- FOR WME SECURITY OPERATIONS USE ONLY -</Text>
        <View style={styles.row}>
          <View style={styles.checkboxItem}><View style={styles.checkbox}></View><Text style={styles.checkboxText}>BGC Cleared</Text></View>
          <View style={styles.checkboxItem}><View style={styles.checkbox}></View><Text style={styles.checkboxText}>ID Verified</Text></View>
          <View style={styles.checkboxItem}><View style={styles.checkbox}></View><Text style={styles.checkboxText}>Watchlist Checked</Text></View>
        </View>
        <View style={styles.row}>
          <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#000', height: 15, marginRight: 10 }} />
          <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#000', height: 15, marginRight: 10 }} />
          <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#000', height: 15 }} />
        </View>
        <View style={styles.row}>
          <View style={{ flex: 1 }}><Text style={styles.boxLabel}>Authorizing Officer</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.boxLabel}>Clearance Level Issued</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.boxLabel}>Badge Number</Text></View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>THIS DOCUMENT CONTAINS SENSITIVE PERSONALLY IDENTIFIABLE INFORMATION (PII).</Text>
        <Text style={styles.footerText}>PAGE 1 OF 2</Text>
      </View>
    </Page>

    {/* PAGE 2: NDA & TERMS */}
    <Page size="A4" style={styles.page}>
      {/* Background Watermark */}
      <View style={styles.watermark}>
        <Text style={styles.watermarkText}>STRICTLY</Text>
        <Text style={styles.watermarkText}>CONFIDENTIAL</Text>
      </View>
      
      {/* Top Bar for Official Look */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>WME-SEC-FRM-0042</Text>
        <Text style={styles.topBarText}>REV: 2026.1 / KR-VIP (APPENDIX A)</Text>
        <Text style={styles.topBarText}>PAGE 2 OF 2</Text>
      </View>
      
      <View style={{ alignItems: 'flex-end', marginBottom: 10, marginTop: -10 }}>
        <View style={styles.barcodeBox}>
          <View style={styles.barThin} /><View style={styles.barThick} /><View style={styles.barThin} />
          <View style={styles.barMedium} /><View style={styles.barThin} /><View style={styles.barThick} />
          <View style={styles.barThin} /><View style={styles.barThick} /><View style={styles.barMedium} />
          <View style={styles.barThin} /><View style={styles.barThin} /><View style={styles.barThick} />
          <View style={styles.barThin} />
        </View>
        <Text style={{ fontSize: 6, fontFamily: 'Courier', marginTop: 2 }}>AUTH-CODE</Text>
      </View>

      <Text style={[styles.mainTitle, { textAlign: 'center', marginTop: 20, marginBottom: 5 }]}>
        NON-DISCLOSURE AGREEMENT & CODE OF CONDUCT
      </Text>
      <Text style={[styles.subTitle, { textAlign: 'center', marginBottom: 20 }]}>
        READ CAREFULLY BEFORE SIGNING
      </Text>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontFamily: 'Times-Bold', fontSize: 10, marginBottom: 4 }}>1. STRICT CONFIDENTIALITY (NDA)</Text>
        <Text style={styles.legalText}>
          The undersigned ("Subject") acknowledges that by being granted access to restricted zones, they may be exposed to confidential, private, or unreleased information regarding Keanu Reeves, upcoming projects, crew members, and WME operations. Subject agrees to hold all such information in the strictest confidence and shall not disclose, publish, tweet, post, or otherwise disseminate any information, photos, videos, or audio recordings obtained during their access period.
        </Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontFamily: 'Times-Bold', fontSize: 10, marginBottom: 4 }}>2. NO PHOTOGRAPHY OR RECORDING</Text>
        <Text style={styles.legalText}>
          UNLESS EXPLICITLY AUTHORIZED BY KR SECURITY OPERATIONS in writing, the use of cellular phones, cameras, recording devices, or any digital capture equipment is strictly prohibited within the perimeter. Security personnel reserve the right to confiscate and wipe any unauthorized recordings.
        </Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontFamily: 'Times-Bold', fontSize: 10, marginBottom: 4 }}>3. CODE OF CONDUCT</Text>
        <Text style={styles.legalText}>
          Subject agrees to maintain respectful, non-disruptive behavior at all times. Harassment, stalking, aggressive behavior, or failure to follow the direct instructions of WME/KR Security will result in immediate physical removal from the premises, permanent revocation of access, and potential law enforcement intervention.
        </Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontFamily: 'Times-Bold', fontSize: 10, marginBottom: 4 }}>4. SEARCH AND SEIZURE CONSENT</Text>
        <Text style={styles.legalText}>
          By entering the restricted perimeter, Subject consents to physical pat-downs, bag checks, and metal detector screenings at any time. Refusal to submit to a search is grounds for immediate expulsion.
        </Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontFamily: 'Times-Bold', fontSize: 10, marginBottom: 4 }}>5. BIOMETRIC RETENTION & CONTINUOUS EVALUATION</Text>
        <Text style={styles.legalText}>
          Subject explicitly consents to the collection, cryptographic hashing, and retention of biometric identifiers (including thumbprints and facial geometry). Subject further consents to continuous background evaluation and open-source intelligence monitoring for the duration of the clearance validity.
        </Text>
      </View>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontFamily: 'Times-Bold', fontSize: 10, marginBottom: 4 }}>6. WAIVER OF LIABILITY AND INDEMNIFICATION</Text>
        <Text style={styles.legalText}>
          Subject assumes all risks of personal injury, property damage, or wrongful death associated with accessing restricted zones. Subject agrees to indemnify, defend, and hold harmless WME, Keanu Reeves, and all affiliated security contractors from any claims or liabilities arising from their presence within the perimeter.
        </Text>
      </View>

      <View style={{ backgroundColor: '#F9F9F9', padding: 15, borderWidth: 1, borderColor: '#000', marginBottom: 20 }}>
        <Text style={{ fontFamily: 'Times-Bold', fontSize: 10, marginBottom: 10, textAlign: 'center', textTransform: 'uppercase' }}>
          Acknowledgment of Terms & Biometric Verification
        </Text>
        <Text style={[styles.legalText, { textAlign: 'center', marginBottom: 20 }]}>
          I HAVE READ, UNDERSTAND, AND AGREE TO BE LEGALLY BOUND BY THE TERMS SET FORTH IN THIS NON-DISCLOSURE AGREEMENT AND CODE OF CONDUCT. I CONSENT TO BIOMETRIC VERIFICATION.
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <View style={{ flex: 4, marginRight: 20 }}>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <View style={{ flex: 1, marginRight: 15 }}>
                <View style={styles.signatureLine} />
                <Text style={styles.boxLabel}>Subject Printed Name</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.signatureLine} />
                <Text style={styles.boxLabel}>Date</Text>
              </View>
            </View>
            <View>
              <View style={styles.signatureLine} />
              <Text style={styles.boxLabel}>Subject Signature</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ width: 60, height: 75, borderWidth: 1, borderColor: '#666', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 6, color: '#999', textAlign: 'center', padding: 4 }}>RIGHT THUMBPRINT (WME AGENT ONLY)</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ backgroundColor: '#EEE', padding: 4, borderWidth: 2, borderColor: '#000', marginBottom: 20 }}>
        <View style={{ backgroundColor: '#FFF', borderWidth: 1, borderColor: '#000', padding: 15 }}>
          <Text style={{ fontFamily: 'Times-Bold', fontSize: 12, textAlign: 'center', textTransform: 'uppercase' }}>DO NOT FILL</Text>
          <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 7, color: '#666', textAlign: 'center', marginBottom: 15, textTransform: 'uppercase' }}>For WME Adjudication Officer Use Only</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: '#666', marginRight: 15, paddingBottom: 15 }}>
              <Text style={{ fontSize: 7, color: '#666', position: 'absolute', bottom: 2 }}>Approving Officer ID</Text>
            </View>
            <View style={{ flex: 1, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: '#666', marginRight: 15, paddingBottom: 15 }}>
              <Text style={{ fontSize: 7, color: '#666', position: 'absolute', bottom: 2 }}>Clearance Status</Text>
            </View>
            <View style={{ flex: 1, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: '#666', paddingBottom: 15 }}>
              <Text style={{ fontSize: 7, color: '#666', position: 'absolute', bottom: 2 }}>Timestamp (UTC)</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>LEGAL APPENDIX - DO NOT SEPARATE FROM MAIN APPLICATION</Text>
        <Text style={styles.footerText}>PAGE 2 OF 2</Text>
      </View>

    </Page>
  </Document>
);

export default BlankApplicationPDF;
