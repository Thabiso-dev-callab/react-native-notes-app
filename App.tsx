import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppStack from './navigation/AppStack';
import { DarkThemeProvider } from './utils/theme';
import { JSX } from 'react/jsx-runtime';

export default function App(): JSX.Element {
  return (
    <DarkThemeProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <AppStack />
        </SafeAreaProvider>
      </PaperProvider>
    </DarkThemeProvider>
  );
}
