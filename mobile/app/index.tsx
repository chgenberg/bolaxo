import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    await authService.loadStoredAuth();
    
    if (authService.user) {
      // User is logged in, redirect based on role
      if (authService.user.role === 'buyer') {
        router.replace('/(buyer)/dashboard');
      } else if (authService.user.role === 'seller') {
        router.replace('/(seller)/dashboard');
      }
    } else {
      // No user, go to login
      router.replace('/(auth)/login');
    }
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1F3C58" />
      <Text style={styles.text}>Laddar...</Text>
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
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
});










