import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#050505',
    padding: 0,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  header: {
    height: 70,
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 3,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#888888',
    fontSize: 7,
    letterSpacing: 2,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  photoWrapper: {
    alignItems: 'center',
    marginTop: 25,
  },
  photoContainer: {
    width: 140,
    height: 175,
    borderWidth: 2,
    borderColor: '#333333',
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  nameArea: {
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  role: {
    color: '#AAAAAA',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    paddingHorizontal: 25,
    justifyContent: 'space-between',
  },
  detailBox: {
    width: '45%',
    marginBottom: 12,
  },
  label: {
    fontSize: 6,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  value: {
    fontSize: 9,
    color: '#E0E0E0',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  barcodeBox: {
    flexDirection: 'row',
    height: 25,
    width: 200,
    justifyContent: 'center',
    marginBottom: 5,
  },
  barThin: { width: 1.5, height: '100%', backgroundColor: '#FFFFFF', marginRight: 1.5 },
  barThick: { width: 4, height: '100%', backgroundColor: '#FFFFFF', marginRight: 1.5 },
  barMed: { width: 2.5, height: '100%', backgroundColor: '#FFFFFF', marginRight: 1.5 },
  idNumber: {
    color: '#FFFFFF',
    fontSize: 10,
    letterSpacing: 3,
    fontFamily: 'Courier',
  },
  microText: {
    position: 'absolute',
    top: 90,
    left: -40,
    transform: 'rotate(-90deg)',
    color: '#222222',
    fontSize: 5,
    letterSpacing: 2,
    fontFamily: 'Courier',
  }
});

export const DigitalCardPDF = ({ application, accentColor = '#D32F2F' }: { application: any, accentColor?: string }) => {
  return (
    <Document>
      <Page size={[306, 486]} style={styles.page}>
        
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: accentColor }]}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>KEANU REEVES</Text>
            <Text style={styles.subtitle}>WME // VIP SECURITY CREDENTIAL</Text>
          </View>
          <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: accentColor, opacity: 0.8 }} />
        </View>

        {/* Side Microtext */}
        <Text style={styles.microText}>AUTH-HASH: {application.id || '000000000000'} // DO NOT DUPLICATE</Text>

        {/* Photo */}
        <View style={styles.photoWrapper}>
          <View style={styles.photoContainer}>
            {application.photoUrl ? (
              <Image source={application.photoUrl} style={styles.photo} />
            ) : (
              <Text style={{ color: '#444', fontSize: 10 }}>NO PHOTO</Text>
            )}
          </View>
        </View>

        {/* Identity */}
        <View style={styles.nameArea}>
          <Text style={styles.name}>{application.cardHolderName || application.legalName || 'N/A'}</Text>
          <Text style={styles.role}>{application.role || 'VIP GUEST'}</Text>
        </View>

        {/* Data Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailBox}>
            <Text style={styles.label}>Clearance Level</Text>
            <Text style={[styles.value, { color: accentColor }]}>{application.accessLevel || 'STANDARD'}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.label}>Department</Text>
            <Text style={styles.value}>{application.department || 'GENERAL'}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.label}>Issued</Text>
            <Text style={styles.value}>{application.issueDate ? new Date(application.issueDate).toLocaleDateString() : 'N/A'}</Text>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.label}>Expires</Text>
            <Text style={styles.value}>{application.expiryDate ? new Date(application.expiryDate).toLocaleDateString() : 'N/A'}</Text>
          </View>
        </View>

        {/* Barcode & ID */}
        <View style={styles.bottomSection}>
          <View style={styles.barcodeBox}>
            <View style={styles.barThick}/><View style={styles.barThin}/><View style={styles.barMed}/><View style={styles.barThin}/><View style={styles.barThick}/><View style={styles.barThin}/><View style={styles.barThin}/><View style={styles.barMed}/><View style={styles.barThick}/><View style={styles.barThin}/><View style={styles.barThin}/><View style={styles.barThick}/><View style={styles.barMed}/><View style={styles.barThin}/><View style={styles.barThin}/><View style={styles.barThick}/><View style={styles.barMed}/><View style={styles.barThin}/>
            <View style={styles.barThick}/><View style={styles.barThin}/><View style={styles.barMed}/><View style={styles.barThin}/><View style={styles.barThick}/>
          </View>
          <Text style={styles.idNumber}>{application.cardNumber || 'PENDING'}</Text>
        </View>

      </Page>
    </Document>
  );
};

export default DigitalCardPDF;
