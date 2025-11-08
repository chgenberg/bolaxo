import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ListingCard } from '../../components/ListingCard';
import { api } from '../../services/api';
import { authService } from '../../services/auth';
import type { Listing } from '../../types';

export default function SavedListingsScreen() {
  const [savedListings, setSavedListings] = React.useState<Listing[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    loadSaved();
  }, []);

  async function loadSaved() {
    if (!authService.user) return;

    try {
      const data = await api.savedListings.getAll(authService.user.id);
      setSavedListings(data.saved?.map((s: any) => s.listing) || []);
    } catch (error) {
      console.error('Error loading saved listings:', error);
    }
  }

  return (
    <View style={styles.container}>
      {savedListings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Inga sparade objekt än</Text>
        </View>
      ) : (
        savedListings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onPress={() => router.push(`/listing/${listing.id}`)}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#6b7280',
  },
});

