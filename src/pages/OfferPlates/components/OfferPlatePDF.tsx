
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CartItem } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  offerSection: {
    marginBottom: 15,
    padding: 10,
    border: '1 solid #eee',
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  offerDescription: {
    fontSize: 12,
    marginBottom: 10,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  price: {
    fontSize: 12,
    marginLeft: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
});

interface OfferPlatePDFProps {
  items: CartItem[];
  offerPlate: any;
}

const OfferPlatePDF: React.FC<OfferPlatePDFProps> = ({ items, offerPlate }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Plaquette d'offres</Text>
        <Text style={styles.subtitle}>{offerPlate.name}</Text>
      </View>

      {items.map((item, index) => (
        <View key={index} style={styles.offerSection}>
          <Text style={styles.offerTitle}>{item.offer.name}</Text>
          <Text style={styles.offerDescription}>{item.offer.description}</Text>
          <View style={styles.priceSection}>
            {item.offer.setupFee > 0 && (
              <Text style={styles.price}>Frais initiaux: {item.offer.setupFee}€</Text>
            )}
            {item.offer.priceMonthly > 0 && (
              <Text style={styles.price}>Mensuel: {item.offer.priceMonthly}€</Text>
            )}
          </View>
        </View>
      ))}

      <View style={styles.footer}>
        <Text>www.i-numa.com</Text>
        <Text>contact@i-numa.com | +33 9 86 40 63</Text>
      </View>
    </Page>
  </Document>
);

export default OfferPlatePDF;
