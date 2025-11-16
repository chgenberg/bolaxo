import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import type { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
  matchScore?: number;
}

export function ListingCard({ listing, onPress, matchScore }: ListingCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.anonymousTitle || listing.companyName}
        </Text>
        {matchScore !== undefined && (
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{matchScore}% match</Text>
          </View>
        )}
      </View>
      
      <View style={styles.details}>
        <Text style={styles.detailText}>{listing.industry}</Text>
        <Text style={styles.detailText}>•</Text>
        <Text style={styles.detailText}>{listing.region}</Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.price}>
          {listing.priceMin && listing.priceMax
            ? `${listing.priceMin / 1000}-${listing.priceMax / 1000} MSEK`
            : 'Pris ej angivet'}
        </Text>
        <Text style={styles.revenue}>
          Omsättning: {listing.revenue / 1000} MSEK
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F3C58',
    flex: 1,
    marginRight: 8,
  },
  matchBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F3C58',
  },
  revenue: {
    fontSize: 14,
    color: '#6b7280',
  },
});










