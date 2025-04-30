import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { CirclePlus as PlusCircle } from 'lucide-react-native';
import ItemCard from '@/components/ItemCard';
import AddItemModal from '@/components/AddItemModal';
import TotalSummary from '@/components/TotalSummary';
import EmptyCart from '@/components/EmptyCart';
import BudgetProgressBar from '@/components/BudgetProgressBar';
import Colors from '@/constants/Colors';

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { items, subtotal, tax, total, budget, removeItem, editItem } = useCart();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const handleAddItem = () => {
    setEditingItem(null);
    setModalVisible(true);
  };
  
  const handleEditItem = (item) => {
    setEditingItem(item);
    setModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingItem(null);
  };
  
  // Animation for empty state
  const emptyOpacity = useRef(new Animated.Value(items.length === 0 ? 1 : 0)).current;
  
  React.useEffect(() => {
    Animated.timing(emptyOpacity, {
      toValue: items.length === 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [items.length]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>SmartCart</Text>
        </View>
        
        {budget > 0 && (
          <View style={styles.budgetContainer}>
            <BudgetProgressBar total={total} budget={budget} />
          </View>
        )}
        
        <View style={styles.content}>
          {items.length > 0 ? (
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ItemCard 
                  item={item} 
                  onEdit={() => handleEditItem(item)} 
                  onRemove={() => removeItem(item.id)} 
                />
              )}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <Animated.View style={[styles.emptyContainer, { opacity: emptyOpacity }]}>
              <EmptyCart />
            </Animated.View>
          )}
        </View>
        
        <View style={styles.footer}>
          <TotalSummary subtotal={subtotal} tax={tax} total={total} />
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <PlusCircle size={24} color="#fff" />
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <AddItemModal 
          visible={modalVisible} 
          onClose={handleCloseModal} 
          editingItem={editingItem}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  list: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  budgetContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
});