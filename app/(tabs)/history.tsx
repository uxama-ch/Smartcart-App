import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity, 
  SafeAreaView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { CalendarDays, ArrowRight, ShoppingBag } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const { shoppingHistory, loadShoppingList } = useCart();
  
  const renderEmptyHistory = () => (
    <View style={styles.emptyContainer}>
      <CalendarDays size={64} color={Colors.textMuted} />
      <Text style={styles.emptyTitle}>No Shopping History</Text>
      <Text style={styles.emptyText}>
        Your previous shopping trips will appear here
      </Text>
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => loadShoppingList(item)}
    >
      <View style={styles.historyItemLeft}>
        <ShoppingBag size={24} color={Colors.primary} />
        <View style={styles.historyItemDetails}>
          <Text style={styles.historyItemDate}>{item.date}</Text>
          <Text style={styles.historyItemCount}>
            {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>
      
      <View style={styles.historyItemRight}>
        <Text style={styles.historyItemTotal}>${item.total.toFixed(2)}</Text>
        <ArrowRight size={18} color={Colors.textMuted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Shopping History</Text>
      </View>
      
      <FlatList
        data={shoppingHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderHistoryItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyHistory}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.textDark,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
    color: Colors.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemDetails: {
    marginLeft: 12,
  },
  historyItemDate: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textDark,
  },
  historyItemCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  historyItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemTotal: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: Colors.textDark,
    marginRight: 8,
  },
});