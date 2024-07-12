import React, { ReactNode } from 'react';
import { View, Text, ViewStyle, TouchableOpacity } from 'react-native';

interface CardProps {
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => (
  <View style={{ padding: 16, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
    {children}
  </View>
);

interface ProgressProps {
  value: number;
}

export const Progress: React.FC<ProgressProps> = ({ value }) => (
  <View style={{ height: 8, backgroundColor: '#eee', borderRadius: 4 }}>
    <View style={{ width: `${value}%`, height: '100%', backgroundColor: '#2563eb', borderRadius: 4 }} />
  </View>
);

interface TabsProps {
  children: ReactNode;
  defaultValue?: string;
  style?: ViewStyle;
}

export const Tabs: React.FC<TabsProps> = ({ children, style }) => <View style={style}>{children}</View>;
export const TabsList: React.FC<{ children: ReactNode }> = ({ children }) => <View style={{ flexDirection: 'row' }}>{children}</View>;

interface TabsTriggerProps {
  children: ReactNode;
  onPress: () => void;
  value: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, onPress, value }) => (
  <TouchableOpacity style={{ padding: 8 }} onPress={onPress}>
    {children}
  </TouchableOpacity>
);
