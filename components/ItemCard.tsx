import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';
import { CreditCard as Edit, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

type ItemCardProps = {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    total: number;
  };
  onEdit: () => void;
  onRemove: () => void;
};

export default function ItemCard({ item, onEdit, onRemove }: ItemCardProps) {
  // Animation values
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  
  const handleRemove = () => {
    // Play remove animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onRemove();
    });
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [
            { scale },
            { translateX }
          ],
          opacity
        }
      ]}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemPrice}>
          ${item.price.toFixed(2)} × {item.quantity}
        </Text>
      </View>
      
      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>
          ${item.total.toFixed(2)}
        </Text>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={onEdit}
          >
            <Edit size={16} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.removeButton]} 
            onPress={handleRemove}
          >
            <Trash2 size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 4,
  },
  itemPrice: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textMuted,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTotal: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: Colors.textDark,
    marginRight: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: Colors.primary,
  },
  removeButton: {
    backgroundColor: Colors.danger,
  },
});