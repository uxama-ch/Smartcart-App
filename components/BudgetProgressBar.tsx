import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Colors from '@/constants/Colors';

type BudgetProgressBarProps = {
  total: number;
  budget: number;
};

export default function BudgetProgressBar({ total, budget }: BudgetProgressBarProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  const getPercentage = () => {
    if (budget <= 0) return 0;
    return Math.min(100, (total / budget) * 100);
  };
  
  const percentage = getPercentage();
  
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: percentage / 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [total, budget]);
  
  const getProgressColor = () => {
    if (percentage < 75) return Colors.success;
    if (percentage < 100) return Colors.warning;
    return Colors.danger;
  };
  
  const animatedWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  
  const progressColor = getProgressColor();
  
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Budget: ${budget.toFixed(2)}</Text>
        <Text style={[styles.percentage, { color: progressColor }]}>
          {percentage.toFixed(0)}%
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { 
              width: animatedWidth,
              backgroundColor: progressColor 
            }
          ]} 
        />
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.spent}>Spent: ${total.toFixed(2)}</Text>
        <Text style={styles.remaining}>
          Remaining: ${(budget - total > 0 ? budget - total : 0).toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.textDark,
  },
  percentage: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  progressContainer: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  spent: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textMuted,
  },
  remaining: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.textMuted,
  },
});