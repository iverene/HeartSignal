import { useNavigation } from '@react-navigation/native';
import { Button, Text, View } from "react-native";

export default function Index() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-primary text-3xl font-bold mb-6">HeartSignal</Text>
      <Button title="Sign Up / Log In" onPress={() => navigation.navigate('UsernameSetup')} />
    </View>
  );
}
