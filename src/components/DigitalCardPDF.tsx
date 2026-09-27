import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: 120,
    left: 80,
    opacity: 0.15,
    transform: 'rotate(-30deg)',
    fontSize: 70,
    color: '#000000',
    fontWeight: 'bold',
    letterSpacing: 10,
    zIndex: 10,
  },
  leftColumn: {
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightColumn: {
    width: '65%',
    paddingLeft: 20,
    justifyContent: 'center',
  },
  photoContainer: {
    width: 110,
    height: 140,
    backgroundColor: '#F3F4F6',
    border: '2px solid #E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  orgHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  roleDept: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    marginBottom: 10,
  },
  label: {
    fontSize: 7,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 8,
    height: '100%',
    backgroundColor: '#3B82F6', // Default to corporate blue
  }
});

export const DigitalCardPDF = ({ application, accentColor = '#3B82F6' }: { application: any, accentColor?: string }) => (
  <Document>
    {/* Landscape CR80 standard scaled: 486 x 306 */}
    <Page size={[486, 306]} style={styles.page}>
      
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <Text style={styles.watermark}>PREVIEW</Text>
      
      <View style={styles.leftColumn}>
        <View style={styles.photoContainer}>
          {application.photoUrl ? (
            <Image source={application.photoUrl} style={styles.photo} />
          ) : (
            <Text style={{ color: '#9CA3AF', fontSize: 10 }}>NO PHOTO</Text>
          )}
        </View>
      </View>

      <View style={styles.rightColumn}>
        <Text style={styles.orgHeader}>Organization Identity Prototype</Text>
        
        <Text style={styles.name}>{application.cardHolderName || application.legalName || 'N/A'}</Text>
        <Text style={styles.roleDept}>
          {application.role || 'Member'} • {application.department || application.fanClubAffiliation || 'General'}
        </Text>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Access Category</Text>
            <Text style={styles.value}>{application.accessLevel || 'N/A'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Reference No.</Text>
            <Text style={styles.value}>{application.cardNumber || 'PENDING'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Issue Date</Text>
            <Text style={styles.value}>
              {application.issueDate ? new Date(application.issueDate).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Expiration Date</Text>
            <Text style={styles.value}>
              {application.expiryDate ? new Date(application.expiryDate).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>
      </View>
      
    </Page>
  </Document>
);

export default DigitalCardPDF;
