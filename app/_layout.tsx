import { Stack } from 'expo-router';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ThemeProvider } from '../context/ThemeContext';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'JosefinSans-Regular': require('../assets/fonts/JosefinSans-Regular.ttf'),
    'JosefinSans-Bold': require('../assets/fonts/JosefinSans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
        </Stack>
      </ThemeProvider>
    </ConvexProvider>
  );
}