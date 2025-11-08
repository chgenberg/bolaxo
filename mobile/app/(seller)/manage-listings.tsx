import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ManageListingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hantera annonser - Kommer snart!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#6b7280',
  },
});

