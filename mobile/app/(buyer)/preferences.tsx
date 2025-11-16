import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../services/api';
import { authService } from '../../services/auth';
import type { BuyerProfile } from '../../types';

export default function BuyerPreferencesScreen() {
  const [preferences, setPreferences] = React.useState<Partial<BuyerProfile>>({
    preferredRegions: [],
    preferredIndustries: [],
    priceMin: undefined,
    priceMax: undefined,
    revenueMin: undefined,
    revenueMax: undefined,
  });
  const [saving, setSaving] = React.useState(false);
  const router = useRouter();

  const regions = ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala', 'Hela Sverige'];
  const industries = [
    'IT & Teknik',
    'E-handel',
    'Tjänster',
    'Tillverkning',
    'Handel',
    'Restaurang',
    'Fastighet',
  ];

  async function handleSave() {
    if (!authService.user) return;

    setSaving(true);
    try {
      await api.buyerProfile.update({
        userId: authService.user.id,
        ...preferences,
      });
      router.back();
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  }

  function toggleRegion(region: string) {
    setPreferences((prev) => ({
      ...prev,
      preferredRegions: prev.preferredRegions?.includes(region)
        ? prev.preferredRegions.filter((r) => r !== region)
        : [...(prev.preferredRegions || []), region],
    }));
  }

  function toggleIndustry(industry: string) {
    setPreferences((prev) => ({
      ...prev,
      preferredIndustries: prev.preferredIndustries?.includes(industry)
        ? prev.preferredIndustries.filter((i) => i !== industry)
        : [...(prev.preferredIndustries || []), industry],
    }));
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Välj regioner</Text>
        <View style={styles.chipContainer}>
          {regions.map((region) => (
            <TouchableOpacity
              key={region}
              style={[
                styles.chip,
                preferences.preferredRegions?.includes(region) && styles.chipSelected,
              ]}
              onPress={() => toggleRegion(region)}
            >
              <Text
                style={[
                  styles.chipText,
                  preferences.preferredRegions?.includes(region) && styles.chipTextSelected,
                ]}
              >
                {region}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Välj branscher</Text>
        <View style={styles.chipContainer}>
          {industries.map((industry) => (
            <TouchableOpacity
              key={industry}
              style={[
                styles.chip,
                preferences.preferredIndustries?.includes(industry) && styles.chipSelected,
              ]}
              onPress={() => toggleIndustry(industry)}
            >
              <Text
                style={[
                  styles.chipText,
                  preferences.preferredIndustries?.includes(industry) && styles.chipTextSelected,
                ]}
              >
                {industry}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prisintervall (MSEK)</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Min"
            keyboardType="numeric"
            value={preferences.priceMin?.toString()}
            onChangeText={(text) =>
              setPreferences((prev) => ({ ...prev, priceMin: parseFloat(text) || undefined }))
            }
          />
          <Text style={styles.inputSeparator}>-</Text>
          <TextInput
            style={styles.input}
            placeholder="Max"
            keyboardType="numeric"
            value={preferences.priceMax?.toString()}
            onChangeText={(text) =>
              setPreferences((prev) => ({ ...prev, priceMax: parseFloat(text) || undefined }))
            }
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>{saving ? 'Sparar...' : 'Spara preferenser'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F3C58',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipSelected: {
    backgroundColor: '#1F3C58',
    borderColor: '#1F3C58',
  },
  chipText: {
    fontSize: 14,
    color: '#6b7280',
  },
  chipTextSelected: {
    color: '#fff',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputSeparator: {
    fontSize: 16,
    color: '#6b7280',
  },
  saveButton: {
    margin: 16,
    backgroundColor: '#1F3C58',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});










