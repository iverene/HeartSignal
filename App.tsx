import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { ActivityIndicator, View } from 'react-native';
import Index from './screens/Index';
import UsernameSetup from './screens/UsernameSetup';
import Home from './screens/Home';
import Settings from './screens/Settings';
import Notifications from './screens/Notifications';


const Stack = createNativeStackNavigator();

export default function App() {

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });


  if (!fontsLoaded) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="UsernameSetup" component={UsernameSetup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Notifications" component={Notifications} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
