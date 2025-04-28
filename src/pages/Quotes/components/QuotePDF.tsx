
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Quote, CartItem } from "@/types";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  info: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 5,
  },
  headerRow: {
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },
  priceCell: {
    width: 80,
    textAlign: 'right',
  },
  total: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentInfo: {
    marginTop: 40,
    fontSize: 10,
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

interface QuotePDFProps {
  quote: Quote;
  items: CartItem[];
  clientName?: string;
  paymentInfo?: {
    bankName: string;
    iban: string;
    bic: string;
  };
}

const QuotePDF: React.FC<QuotePDFProps> = ({ quote, items, clientName, paymentInfo }) => {
  const totalHT = items.reduce((acc, item) => acc + (item.offer.priceMonthly * item.quantity), 0);
  const tva = totalHT * 0.2;
  const totalTTC = totalHT + tva;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Devis #{quote.id.substring(0, 8)}</Text>
          <Text style={styles.info}>Date: {format(new Date(quote.createdAt), 'dd/MM/yyyy', { locale: fr })}</Text>
          <Text style={styles.info}>Client: {clientName}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.cell}>Offre</Text>
            <Text style={styles.cell}>Description</Text>
            <Text style={[styles.cell, styles.priceCell]}>Prix mensuel</Text>
            <Text style={[styles.cell, styles.priceCell]}>Quantité</Text>
            <Text style={[styles.cell, styles.priceCell]}>Total</Text>
          </View>

          {items.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{item.offer.name}</Text>
              <Text style={styles.cell}>{item.offer.description}</Text>
              <Text style={[styles.cell, styles.priceCell]}>{item.offer.priceMonthly}€</Text>
              <Text style={[styles.cell, styles.priceCell]}>{item.quantity}</Text>
              <Text style={[styles.cell, styles.priceCell]}>
                {(item.offer.priceMonthly * item.quantity).toFixed(2)}€
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.total}>
          <View>
            <Text style={styles.totalText}>Total HT: {totalHT.toFixed(2)}€</Text>
            <Text style={styles.totalText}>TVA (20%): {tva.toFixed(2)}€</Text>
            <Text style={styles.totalText}>Total TTC: {totalTTC.toFixed(2)}€</Text>
          </View>
        </View>

        {paymentInfo && (
          <View style={styles.paymentInfo}>
            <Text>Informations de paiement:</Text>
            <Text>Banque: {paymentInfo.bankName}</Text>
            <Text>IBAN: {paymentInfo.iban}</Text>
            <Text>BIC: {paymentInfo.bic}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>i-numa.com</Text>
          <Text>contact@i-numa.com | +33 9 86 40 63</Text>
          <Text>Ce devis est valable 7 jours à compter de sa date d'émission</Text>
        </View>
      </Page>
    </Document>
  );
};

export default QuotePDF;
