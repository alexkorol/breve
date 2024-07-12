import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressProps {
  value: number;
}

const Progress: React.FC<ProgressProps> = ({ value }) => {
  return (
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${value}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
});

export default Progress;