import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#000000',
    padding: 0,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: 150,
    left: -20,
    opacity: 0.1,
    transform: 'rotate(-45deg)',
    fontSize: 50,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#990000',
    padding: 15,
    alignItems: 'center',
    borderBottom: '4px solid #FFFFFF',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 2,
  },
  headerSub: {
    color: '#FFFFFF',
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  photoContainer: {
    width: 120,
    height: 140,
    margin: '20px auto 15px auto',
    border: '3px solid #FFFFFF',
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  detailsBlock: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  accessBadge: {
    backgroundColor: '#FFFFFF',
    color: '#000000',
    padding: '4px 10px',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 15,
  },
  footerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 25,
    width: '100%',
  },
  footerBlock: {
    alignItems: 'center',
  },
  footerLabel: {
    color: '#888888',
    fontSize: 6,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  footerValue: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Courier-Bold',
  },
  barcodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 15,
    position: 'absolute',
    bottom: 5,
    width: '100%',
  },
  barThin: { width: 1, height: '100%', backgroundColor: '#FFFFFF', marginRight: 1 },
  barThick: { width: 3, height: '100%', backgroundColor: '#FFFFFF', marginRight: 1 },
  barMedium: { width: 2, height: '100%', backgroundColor: '#FFFFFF', marginRight: 1 },
});

export const DigitalCardPDF = ({ application }: { application: any }) => (
  <Document>
    {/* Standard ID Card Size (CR80 multiplied by 2 for quality): 3.375 x 2.125 inches */}
    <Page size={[306, 486]} style={styles.page}>
      
      <Text style={styles.watermark}>WME</Text>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VIP ACCESS</Text>
        <Text style={styles.headerSub}>Keanu Reeves Security Ops</Text>
      </View>

      <View style={styles.photoContainer}>
        {application.photoUrl ? (
          <Image source={application.photoUrl} style={styles.photo} />
        ) : (
          <Text style={{ color: '#666', fontSize: 10 }}>NO PHOTO</Text>
        )}
      </View>

      <View style={styles.detailsBlock}>
        <Text style={styles.name}>{application.cardHolderName || application.legalName}</Text>
        <Text style={styles.accessBadge}>{application.accessLevel}</Text>
      </View>

      <View style={styles.footerGrid}>
        <View style={styles.footerBlock}>
          <Text style={styles.footerLabel}>Clearance ID</Text>
          <Text style={styles.footerValue}>{application.cardNumber || 'PENDING'}</Text>
        </View>
        <View style={styles.footerBlock}>
          <Text style={styles.footerLabel}>Valid Thru</Text>
          <Text style={styles.footerValue}>
            {application.expiryDate ? new Date(application.expiryDate).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.barcodeBox}>
        <View style={styles.barThin} /><View style={styles.barThick} /><View style={styles.barThin} />
        <View style={styles.barMedium} /><View style={styles.barThin} /><View style={styles.barThick} />
        <View style={styles.barThin} /><View style={styles.barThick} /><View style={styles.barMedium} />
        <View style={styles.barThin} /><View style={styles.barThin} /><View style={styles.barThick} />
        <View style={styles.barThin} /><View style={styles.barThick} />
      </View>
      
    </Page>
  </Document>
);

export default DigitalCardPDF;
