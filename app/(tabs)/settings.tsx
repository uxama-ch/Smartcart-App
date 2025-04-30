import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Switch
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '@/context/CartContext';
import { Percent, DollarSign, RotateCcw } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { taxRate, setTaxRate, budget, setBudget, clearCart } = useCart();
  
  const [tempTaxRate, setTempTaxRate] = useState(taxRate.toString());
  const [tempBudget, setTempBudget] = useState(budget ? budget.toString() : '');
  const [budgetEnabled, setBudgetEnabled] = useState(budget > 0);
  
  const handleTaxRateChange = (value) => {
    setTempTaxRate(value);
  };
  
  const handleBudgetChange = (value) => {
    setTempBudget(value);
  };
  
  const handleSaveTaxRate = () => {
    const newTaxRate = parseFloat(tempTaxRate);
    if (!isNaN(newTaxRate) && newTaxRate >= 0) {
      setTaxRate(newTaxRate);
    } else {
      setTempTaxRate(taxRate.toString());
    }
  };
  
  const handleSaveBudget = () => {
    if (budgetEnabled) {
      const newBudget = parseFloat(tempBudget);
      if (!isNaN(newBudget) && newBudget > 0) {
        setBudget(newBudget);
      } else {
        setTempBudget(budget ? budget.toString() : '0');
        setBudgetEnabled(budget > 0);
      }
    } else {
      setBudget(0);
    }
  };
  
  const handleResetCart = () => {
    clearCart();
  };
  
  const toggleBudget = (value) => {
    setBudgetEnabled(value);
    if (!value) {
      setBudget(0);
    } else if (tempBudget && parseFloat(tempBudget) > 0) {
      setBudget(parseFloat(tempBudget));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Settings</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sales Tax</Text>
            <View style={styles.inputContainer}>
              <Percent size={18} color={Colors.textDark} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={tempTaxRate}
                onChangeText={handleTaxRateChange}
                keyboardType="decimal-pad"
                placeholder="Enter sales tax rate (%)"
                placeholderTextColor="#999"
                onBlur={handleSaveTaxRate}
              />
            </View>
            <Text style={styles.helper}>Current sales tax rate: {taxRate}%</Text>
          </View>
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Budget</Text>
              <Switch
                value={budgetEnabled}
                onValueChange={toggleBudget}
                trackColor={{ false: '#e0e0e0', true: Colors.success }}
                thumbColor="#fff"
              />
            </View>
            
            {budgetEnabled && (
              <View style={styles.inputContainer}>
                <DollarSign size={18} color={Colors.textDark} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={tempBudget}
                  onChangeText={handleBudgetChange}
                  keyboardType="decimal-pad"
                  placeholder="Enter your shopping budget"
                  placeholderTextColor="#999"
                  onBlur={handleSaveBudget}
                />
              </View>
            )}
            {budgetEnabled && budget > 0 && (
              <Text style={styles.helper}>Current budget: ${budget.toFixed(2)}</Text>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reset Cart</Text>
            <TouchableOpacity style={styles.resetButton} onPress={handleResetCart}>
              <RotateCcw size={18} color="#fff" />
              <Text style={styles.resetButtonText}>Clear All Items</Text>
            </TouchableOpacity>
            <Text style={styles.warning}>This will remove all items from your current cart</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: Colors.textDark,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.textDark,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.textDark,
    padding: 12,
  },
  helper: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textMuted,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.danger,
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
  },
  resetButtonText: {
    fontFamily: 'Inter-Medium',
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  warning: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.danger,
  },
});