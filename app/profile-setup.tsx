import React, { useState } from 'react';
import { 
  Image, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- IMPORT

export default function UsernameSetup() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedIconIndex, setSelectedIconIndex] = useState<number | null>(null);

  const icons = [
    require('../assets/icon1.png'),
    require('../assets/icon2.png'),
    require('../assets/icon3.png'),
    require('../assets/icon4.png'),
    require('../assets/icon5.png'),
    require('../assets/icon6.png')
  ];

  const isFormValid = username.length > 0 && selectedIconIndex !== null;

  const handleContinue = async () => { // <--- Make ASYNC
    if (!isFormValid) return;
    
    try {
      // Save data to AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify({
        username: username,
        iconIndex: selectedIconIndex
      }));
    } catch (error) {
      console.error("Error saving profile:", error);
    }

    router.replace('/home'); 
  };

  return (
    <View className="flex-1 bg-[#FDFBF7]">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="mt-6 mb-10">
              <Text className="text-3xl font-bold text-[#36454F] mb-2 tracking-tight">
                Who is sending the signal?
              </Text>
              <Text className="text-[#36454F] opacity-60 text-base leading-6">
                Create your anonymous identity to connect with hearts nearby.
              </Text>
            </View>

            <View className="mb-10">
              <Text className="text-sm font-bold text-[#36454F] uppercase tracking-wider mb-3 ml-1 opacity-80">
                Display Name
              </Text>
              <TextInput 
                className={`w-full bg-white border-2 rounded-2xl p-5 text-xl text-[#36454F] font-medium
                  ${isInputFocused ? 'border-[#FF5C8D]' : 'border-transparent'}
                `}
                placeholder="e.g. IvereneCutie"
                placeholderTextColor="#A0AEC0"
                value={username}
                onChangeText={setUsername}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                maxLength={20}
                style={{ 
                  elevation: 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2
                }}
              />
            </View>

            <View className="flex-1">
              <Text className="text-sm font-bold text-[#36454F] uppercase tracking-wider mb-5 ml-1 opacity-80">
                Choose an Avatar
              </Text>
              
              <View className="flex-row flex-wrap justify-between">
                {icons.map((icon, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    onPress={() => setSelectedIconIndex(idx)}
                    activeOpacity={0.8}
                    className={`mb-6 items-center justify-center rounded-full w-[30%] aspect-square
                      ${selectedIconIndex === idx 
                        ? 'border-4 border-[#FF5C8D] bg-white' 
                        : 'border-4 border-white bg-white'
                      }
                    `}
                    style={{
                      shadowColor: "#36454F",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.08,
                      shadowRadius: 8,
                      elevation: 3
                    }}
                  >
                    <Image 
                      source={icon} 
                      className="w-full h-full rounded-full"
                      resizeMode="cover"
                    />

                    {selectedIconIndex === idx && (
                      <View className="absolute bottom-0 right-0 bg-[#FF5C8D] rounded-full w-7 h-7 items-center justify-center border-2 border-white">
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <TouchableOpacity 
                onPress={handleContinue}
                className={`w-full py-5 rounded-full items-center flex-row justify-center
                  ${isFormValid ? 'bg-primary' : 'bg-[#E2E8F0]'}
                `}
                disabled={!isFormValid}
                style={isFormValid ? {
                  shadowColor: '#FF5C8D',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4
                } : {}}
              >
                <Text className={`text-lg font-bold ${isFormValid ? 'text-white' : 'text-gray-400'}`}>
                  Start Signaling
                </Text>
                {isFormValid && (
                  <Ionicons name="arrow-forward" size={20} color="white" style={{ marginLeft: 8 }} />
                )}
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}