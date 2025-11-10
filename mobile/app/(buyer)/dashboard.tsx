import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import { ListingCard } from '../../components/ListingCard';
import { NotificationBadge } from '../../components/NotificationBadge';
import type { Listing, Match } from '../../types';
import { authService } from '../../services/auth';

export default function BuyerDashboard() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
    
    // Poll for updates every 15 seconds
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, []);

  async function loadData() {
    if (!authService.user) return;

    try {
      // Load matches (this would need a buyer-specific endpoint)
      // For now, load all active listings
      const listingsData = await api.listings.getAll({ status: 'active' });
      setListings(listingsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function handleRefresh() {
    setRefreshing(true);
    loadData();
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Matchningar</Text>
        <TouchableOpacity onPress={() => router.push('/(buyer)/preferences')}>
          <Text style={styles.link}>Uppdatera preferenser</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Laddar...</Text>
      ) : listings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Inga matchningar än</Text>
          <Text style={styles.emptySubtext}>
            Uppdatera dina preferenser för att få matchningar
          </Text>
        </View>
      ) : (
        listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onPress={() => router.push(`/listing/${listing.id}`)}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F3C58',
  },
  link: {
    fontSize: 14,
    color: '#1F3C58',
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#6b7280',
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F3C58',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});


