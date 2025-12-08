import { useNavigation } from '@react-navigation/native';
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

export default function UsernameSetup() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedIconIndex, setSelectedIconIndex] = useState<number | null>(null);

  // Using the requested placeholder icon path
  const icons = [
    require('../assets/icon1.png'),
    require('../assets/icon2.png'),
    require('../assets/icon3.png'),
    require('../assets/icon4.png'),
    require('../assets/icon5.png'),
    require('../assets/icon6.png')
  ];

  const isFormValid = username.length > 0 && selectedIconIndex !== null;

  const handleContinue = () => {
    if (!isFormValid) return;
    
    console.log(`Profile created: ${username} with icon index ${selectedIconIndex}`);
    // @ts-ignore
    // navigation.navigate('Home'); 
  };

  return (
    // Background: Calm Cream (#FDFBF7)
    <View className="flex-1 bg-ghostWhite">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 }}
            showsVerticalScrollIndicator={false}
          >
            
            {/* --- Header (Revised to match theme) --- */}
            <View className="mt-6 mb-10">
              <Text className="text-3xl font-bold text-[#36454F] mb-2 tracking-tight">
                Who is sending the signal?
              </Text>
              <Text className="text-[#36454F] opacity-60 text-base leading-6">
                Create your anonymous identity to connect with hearts nearby.
              </Text>
            </View>

            {/* --- Input Section --- */}
            <View className="mb-10">
              <Text className="text-sm font-bold text-[#36454F] uppercase tracking-wider mb-3 ml-1 opacity-80">
                Display Name
              </Text>
              <TextInput 
                className={`w-full bg-white border-2 rounded-2xl p-5 text-xl text-[#36454F] font-medium
                  ${isInputFocused 
                    ? 'border-primary shadow-sm' // Active: Passion Pink
                    : 'border-transparent shadow-sm' // Inactive: Clean white look
                  }
                `}
                placeholder="e.g. cutie"
                placeholderTextColor="#A0AEC0"
                value={username}
                onChangeText={setUsername}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                maxLength={20}
                style={{ elevation: 2 }} // Subtle elevation for depth
              />
            </View>

            {/* --- Avatar Selection (Circular) --- */}
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
                    // Container: Circle shape, white bg, shadow
                    className={`mb-6 items-center justify-center rounded-full w-[30%] aspect-square
                      ${selectedIconIndex === idx 
                        ? 'border-4 border-primary bg-white' // Selected: Pink Border
                        : 'border-4 border-white bg-white'      // Unselected: White Border
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
                    {/* Image: Fully circular and contained */}
                    <Image 
                      source={icon} 
                      className="w-full h-full rounded-full"
                      resizeMode="cover"
                    />

                    {/* Selection Indicator (Checkmark) */}
                    {selectedIconIndex === idx && (
                      <View className="absolute bottom-0 right-0 bg-[#FF5C8D] rounded-full w-7 h-7 items-center justify-center border-2 border-white">
                        <Ionicons name="checkmark" size={16} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* --- Continue Button --- */}
            <View className="mb-4">
              <TouchableOpacity 
                onPress={handleContinue}
                className={`w-full py-5 rounded-full items-center flex-row justify-center
                  ${isFormValid 
                    ? 'bg-primary shadow-lg shadow-[#FF5C8D]/30' // Passion Pink
                    : 'bg-[#E2E8F0]' // Disabled Gray
                  }
                `}
                disabled={!isFormValid}
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