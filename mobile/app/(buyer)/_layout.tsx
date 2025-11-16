import { Stack } from 'expo-router';

export default function BuyerLayout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="matches" options={{ title: 'Matchningar' }} />
      <Stack.Screen name="preferences" options={{ title: 'Preferenser' }} />
      <Stack.Screen name="saved" options={{ title: 'Sparade objekt' }} />
    </Stack>
  );
}










