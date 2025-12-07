import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
// import Home from './screens/Home';
// import Index from './screens/Index';
// import Notifications from './screens/Notifications';
// import Settings from './screens/Settings';
import UsernameSetup from './screens/UsernameSetup';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Index" component={Index} />
        <Stack.Screen name="UsernameSetup" component={UsernameSetup} />
        {/* <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Notifications" component={Notifications} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
