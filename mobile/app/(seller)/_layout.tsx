import { Stack } from 'expo-router';

export default function SellerLayout() {
  return (
    <Stack>
      <Stack.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Stack.Screen name="create-listing" options={{ title: 'Skapa annons' }} />
      <Stack.Screen name="manage-listings" options={{ title: 'Hantera annonser' }} />
    </Stack>
  );
}

