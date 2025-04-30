import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '@/context/CartContext';
import { Save } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type TotalSummaryProps = {
  subtotal: number;
  tax: number;
  total: number;
};

export default function TotalSummary({ subtotal, tax, total }: TotalSummaryProps) {
  const { taxRate, items, saveCurrentList } = useCart();
  
  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Add items to see total</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal:</Text>
        <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.label}>Tax ({taxRate}%):</Text>
        <Text style={styles.value}>${tax.toFixed(2)}</Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={saveCurrentList}
      >
        <Save size={18} color="#fff" />
        <Text style={styles.saveButtonText}>Save to History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textMuted,
  },
  value: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.textDark,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.textDark,
  },
  totalValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.primary,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textMuted,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    padding: 12,
    borderRadius: 8,
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
});