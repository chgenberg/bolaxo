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
import type { Listing, NDARequest } from '../../types';
import { authService } from '../../services/auth';

export default function SellerDashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [ndaRequests, setNdaRequests] = useState<NDARequest[]>([]);
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
      const [listingsData, ndaData] = await Promise.all([
        api.listings.getAll({ userId: authService.user.id }),
        api.ndaRequests.getAll({ userId: authService.user.id, role: 'seller' }),
      ]);
      
      setListings(listingsData || []);
      setNdaRequests(ndaData?.requests || []);
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

  const pendingNDAs = ndaRequests.filter((n) => n.status === 'pending');

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Mina annonser</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(seller)/create-listing')}
        >
          <Text style={styles.buttonText}>+ Ny annons</Text>
        </TouchableOpacity>
      </View>

      {pendingNDAs.length > 0 && (
        <View style={styles.ndaBanner}>
          <Text style={styles.ndaText}>
            {pendingNDAs.length} väntande NDA-förfrågningar
          </Text>
          <NotificationBadge count={pendingNDAs.length} />
        </View>
      )}

      {loading ? (
        <Text style={styles.loading}>Laddar...</Text>
      ) : listings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Inga annonser än</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/(seller)/create-listing')}
          >
            <Text style={styles.emptyButtonText}>Skapa din första annons</Text>
          </TouchableOpacity>
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
  button: {
    backgroundColor: '#1F3C58',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  ndaBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  ndaText: {
    fontSize: 14,
    color: '#92400e',
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
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#1F3C58',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


