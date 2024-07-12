import React from 'react';
import { View, StyleSheet } from 'react-native';
import BreveApp from '../../components/BreveApp';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <BreveApp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});