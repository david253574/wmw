import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    backgroundColor: '#000000',
    padding: 20,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2
  },
  headerSub: {
    color: '#FFFFFF',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  section: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE'
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10
  },
  col: {
    flex: 1,
    paddingRight: 10
  },
  label: {
    fontSize: 9,
    color: '#666666',
    marginBottom: 3,
    textTransform: 'uppercase'
  },
  value: {
    fontSize: 11,
    color: '#000000',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    backgroundColor: '#F5F5F5',
    padding: 5,
    textTransform: 'uppercase'
  },
  photoContainer: {
    width: 100,
    height: 120,
    backgroundColor: '#EEEEEE',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #CCCCCC'
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  signatureContainer: {
    width: 200,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginBottom: 5,
    marginTop: 20
  },
  signature: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#999999',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10
  },
  badgeSection: {
    flexDirection: 'row',
    border: '2px solid #000',
    padding: 10,
    marginTop: 20,
    backgroundColor: '#FAFAFA'
  },
  badgeLeft: {
    width: 120,
    marginRight: 15
  },
  badgeRight: {
    flex: 1,
    justifyContent: 'center'
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  badgeId: {
    fontSize: 12,
    marginBottom: 10,
    fontFamily: 'Courier-Bold'
  },
  badgeAccess: {
    backgroundColor: '#000',
    color: '#FFF',
    padding: 5,
    fontSize: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    width: 120
  }
});

type Application = {
  id: string;
  legalName: string;
  fanClubAffiliation: string | null;
  favoriteMovie: string | null;
  accessLevel: string;
  createdAt: string;
  cardHolderName: string;
  cardNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  photoUrl?: string;
  signatureUrl?: string;
};

interface AccessCardPDFProps {
  application: Application;
}

export const AccessCardPDF: React.FC<AccessCardPDFProps> = ({ application }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>WME</Text>
        <Text style={styles.headerSub}>Keanu Reeves VIP Security Access</Text>
      </View>

      <Text style={styles.title}>Official Record</Text>
      
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Applicant Name</Text>
          <Text style={styles.value}>{application.legalName}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Submission Date</Text>
          <Text style={styles.value}>{new Date(application.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Reference ID</Text>
          <Text style={styles.value}>{application.id.slice(-8).toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Fan Affiliation</Text>
          <Text style={styles.value}>{application.fanClubAffiliation || 'Independent'}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Favorite KR Work</Text>
          <Text style={styles.value}>{application.favoriteMovie || 'Undisclosed'}</Text>
        </View>
      </View>

      <Text style={styles.title}>Approved Credentials</Text>
      
      <View style={styles.badgeSection}>
        <View style={styles.badgeLeft}>
          <View style={styles.photoContainer}>
            {application.photoUrl && (
              <Image source={application.photoUrl} style={styles.photo} />
            )}
          </View>
          <Text style={styles.badgeAccess}>{application.accessLevel}</Text>
        </View>
        <View style={styles.badgeRight}>
          <Text style={styles.label}>Cardholder</Text>
          <Text style={styles.badgeTitle}>{application.cardHolderName}</Text>
          
          <Text style={styles.label}>Card Number</Text>
          <Text style={styles.badgeId}>{application.cardNumber || 'PENDING'}</Text>
          
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Issue Date</Text>
              <Text style={styles.value}>
                {application.issueDate ? new Date(application.issueDate).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Valid Thru</Text>
              <Text style={styles.value}>
                {application.expiryDate ? new Date(application.expiryDate).toLocaleDateString() : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={[styles.title, { marginTop: 30 }]}>Authorization & Verification</Text>
      
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Applicant Signature</Text>
          <View style={styles.signatureContainer}>
            {application.signatureUrl && (
              <Image source={application.signatureUrl} style={styles.signature} />
            )}
          </View>
          <Text style={{ fontSize: 8, color: '#666' }}>Date: {new Date(application.createdAt).toLocaleDateString()}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Authorized By</Text>
          <View style={styles.signatureContainer}>
            {/* Admin signature placeholder */}
          </View>
          <Text style={{ fontSize: 8, color: '#666' }}>WME / KR Security Operations</Text>
        </View>
      </View>

      <Text style={styles.footer}>
        This document contains confidential information intended solely for access card processing and verification purposes. Unauthorized duplication, distribution, or alteration is strictly prohibited and subject to disciplinary action. Property of WME.
      </Text>
    </Page>
  </Document>
);

export default AccessCardPDF;
