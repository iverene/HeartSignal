import { View, Text, TextInput, Button, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";

export default function UsernameSetup() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);

  const icons = [
    require('../assets/icon1.png'),
    require('../assets/icon2.png'),
    require('../assets/icon3.png')
  ];

  return (
    <View className="flex-1 p-6">
      <Text className="text-xl font-bold mb-4">Enter Username</Text>
      <TextInput 
        className="border p-2 mb-4"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Text className="text-xl font-bold mb-2">Choose an Icon</Text>
      <View className="flex-row space-x-4 mb-6">
        {icons.map((icon, idx) => (
          <TouchableOpacity key={idx} onPress={() => setSelectedIcon(icon)}>
            <Image source={icon} className={`w-16 h-16 ${selectedIcon === icon ? 'border-2 border-red-500' : ''}`} />
          </TouchableOpacity>
        ))}
      </View>
      <Button 
        title="Continue" 
        // onPress={() => {
        //   // Save username + icon in backend / state
        //   navigation.navigate('Home');
        // }}
      />
    </View>
  );
}
