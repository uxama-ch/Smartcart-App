import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useCart } from '@/context/CartContext';
import { X, Check } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type AddItemModalProps = {
  visible: boolean;
  onClose: () => void;
  editingItem: any;
};

export default function AddItemModal({ visible, onClose, editingItem }: AddItemModalProps) {
  const { addItem, editItem } = useCart();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setPrice(editingItem.price.toString());
      setQuantity(editingItem.quantity.toString());
    } else {
      resetForm();
    }
  }, [editingItem, visible]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setQuantity('1');
    setNameError('');
    setPriceError('');
  };

  const validateForm = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Item name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    const priceValue = parseFloat(price);
    if (!price || isNaN(priceValue) || priceValue <= 0) {
      setPriceError('Please enter a valid price');
      isValid = false;
    } else {
      setPriceError('');
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const itemData = {
      name: name.trim(),
      price: parseFloat(price),
      quantity: parseInt(quantity, 10) || 1,
    };

    if (editingItem) {
      editItem(editingItem.id, itemData);
    } else {
      addItem(itemData);
    }

    resetForm();
    onClose();
  };

  const incrementQuantity = () => {
    const current = parseInt(quantity, 10) || 0;
    setQuantity((current + 1).toString());
  };

  const decrementQuantity = () => {
    const current = parseInt(quantity, 10) || 0;
    if (current > 1) {
      setQuantity((current - 1).toString());
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Item Name</Text>
              <TextInput
                style={[styles.input, nameError ? styles.inputError : null]}
                value={name}
                onChangeText={setName}
                placeholder="Enter item name"
                placeholderTextColor="#999"
                autoFocus
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Price ($)</Text>
              <TextInput
                style={[styles.input, priceError ? styles.inputError : null]}
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
              />
              {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Quantity</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={decrementQuantity}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.quantityInput}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="number-pad"
                />
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={incrementQuantity}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Check size={20} color="#fff" />
              <Text style={styles.saveButtonText}>
                {editingItem ? 'Update Item' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.textDark,
  },
  closeButton: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textDark,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.textDark,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    marginHorizontal: 12,
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  saveButton: {
    backgroundColor: Colors.success,
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
});