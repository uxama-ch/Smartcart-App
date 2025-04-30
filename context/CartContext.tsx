import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
};

type ShoppingTrip = {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'total'>) => void;
  removeItem: (id: string) => void;
  editItem: (id: string, item: Partial<Omit<CartItem, 'id'>>) => void;
  clearCart: () => void;
  taxRate: number;
  setTaxRate: (rate: number) => void;
  subtotal: number;
  tax: number;
  total: number;
  budget: number;
  setBudget: (budget: number) => void;
  shoppingHistory: ShoppingTrip[];
  saveCurrentList: () => void;
  loadShoppingList: (trip: ShoppingTrip) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [taxRate, setTaxRate] = useState<number>(7.5);
  const [budget, setBudget] = useState<number>(0);
  const [shoppingHistory, setShoppingHistory] = useState<ShoppingTrip[]>([]);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const addItem = (item: Omit<CartItem, 'id' | 'total'>) => {
    const newItem = {
      id: Date.now().toString(),
      ...item,
      total: item.price * item.quantity
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const editItem = (id: string, updatedFields: Partial<Omit<CartItem, 'id'>>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updatedFields };
        // Recalculate total if price or quantity changed
        if (updatedFields.price !== undefined || updatedFields.quantity !== undefined) {
          updatedItem.total = (updatedFields.price || item.price) * 
                             (updatedFields.quantity || item.quantity);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const saveCurrentList = () => {
    if (items.length === 0) return;
    
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const shoppingTrip: ShoppingTrip = {
      id: Date.now().toString(),
      date: formattedDate,
      items: [...items],
      subtotal,
      tax,
      total
    };
    
    setShoppingHistory(prevHistory => [shoppingTrip, ...prevHistory]);
    clearCart();
  };

  const loadShoppingList = (trip: ShoppingTrip) => {
    setItems(trip.items);
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    editItem,
    clearCart,
    taxRate,
    setTaxRate,
    subtotal,
    tax,
    total,
    budget,
    setBudget,
    shoppingHistory,
    saveCurrentList,
    loadShoppingList
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};