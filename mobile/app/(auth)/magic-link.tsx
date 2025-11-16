import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService } from '../../services/auth';

export default function MagicLinkScreen() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    // If token comes from deep link
    if (params.token) {
      setToken(params.token as string);
      handleVerify(params.token as string);
    }
  }, [params]);

  async function handleVerify(verifyToken?: string) {
    const tokenToVerify = verifyToken || token;
    
    if (!tokenToVerify) {
      Alert.alert('Fel', 'Vänligen ange din magic link token');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyMagicLink(tokenToVerify);
      
      // Redirect based on user role
      if (authService.user) {
        if (authService.user.role === 'buyer') {
          router.replace('/(buyer)/dashboard');
        } else if (authService.user.role === 'seller') {
          router.replace('/(seller)/dashboard');
        }
      }
    } catch (error: any) {
      Alert.alert('Fel', error.message || 'Ogiltig eller utgången token');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verifiera din inloggning</Text>
        <Text style={styles.subtitle}>
          Klistra in token från din e-post eller klicka på länken i mailet
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Magic link token"
          placeholderTextColor="#9ca3af"
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => handleVerify()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Verifierar...' : 'Verifiera'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F3C58',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
  },
  button: {
    backgroundColor: '#1F3C58',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});










