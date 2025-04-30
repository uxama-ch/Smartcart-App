import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image 
} from 'react-native';
import { ShoppingBag } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function EmptyCart() {
  return (
    <View style={styles.container}>
      <ShoppingBag size={80} color={Colors.textMuted} />
      <Text style={styles.title}>Your cart is empty</Text>
      <Text style={styles.description}>
        Add items to your shopping cart to see them here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: Colors.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});