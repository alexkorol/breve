import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  style?: any;
}

interface TabsListProps {
  children: React.ReactNode;
  style?: any;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  onPress?: () => void;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, children, style }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabPress = (value: string) => {
    setActiveTab(value);
  };

  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          activeTab,
          handleTabPress,
        });
      }
      return child;
    });
  };

  return (
    <View style={style}>
      {renderChildren()}
    </View>
  );
};

const TabsList: React.FC<TabsListProps> = ({ children, style }) => {
  return (
    <View style={[styles.tabsList, style]}>
      {children}
    </View>
  );
};

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.tabsTrigger}>
      {children}
    </TouchableOpacity>
  );
};

const TabsContent: React.FC<TabsContentProps> = ({ value, children }) => {
  return (
    <View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  tabsTrigger: {
    padding: 10,
  },
});

export { Tabs, TabsList, TabsTrigger, TabsContent };