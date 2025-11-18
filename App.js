import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Inicio from './screens/Inicio';
import Registros_P from './screens/Registross_P';
import Gerenciar from './screens/Gerenciar';

import LocalDB from './services/LocalDB';

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';

import { useFonts } from 'expo-font';

const Stack = createNativeStackNavigator();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const [fontsLoaded] = useFonts({
    'OpenSans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'OpenSansBold': require('./assets/fonts/OpenSans-Bold.ttf'),
  });

  async function initializeApp() {
    try {
      await LocalDB.load();
      setAppReady(true);
    } catch (error) {
      console.error('Erro ao inicializar app:', error);
      setAppReady(true);
    }
  }

  if (!fontsLoaded || !appReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Inicio' component={Inicio} />
        <Stack.Screen
          name='Registrar_P'
          component={Registros_P}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#ffffff'
          }}
        />
        <Stack.Screen
          name='Gerenciar'
          component={Gerenciar}
          options={{
            headerShown: true,
            title: '',
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#ffffff'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});