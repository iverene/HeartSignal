import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // <--- CHANGE 1
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withDelay,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// ... (RadarRing component remains exactly the same) ...
const RadarRing = ({ delay }: { delay: number }) => {
  const ringProgress = useSharedValue(0);

  useEffect(() => {
    ringProgress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.out(Easing.ease) }),
        -1, // Infinite
        false
      )
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(ringProgress.value, [0, 0.7, 1], [0.5, 0.2, 0]),
      transform: [
        { scale: interpolate(ringProgress.value, [0, 1], [1, 3]) },
      ],
    };
  });

  return (
    <Animated.View 
      className="absolute w-[120px] h-[120px] rounded-full border border-[#FF9E9E] bg-[#FFECEF]"
      style={ringStyle}
    />
  );
};

export default function Index() {
  const router = useRouter(); // <--- CHANGE 2

  const handleGoogleSignIn = async () => {
    // Navigate to the setup screen
    // Make sure you have a file named 'app/username-setup.tsx' or 'app/profile-setup.tsx'
    router.push('/profile-setup'); // <--- CHANGE 3
  };

  return (
    <View className="flex-1 bg-ghostWhite relative overflow-hidden">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-8 justify-between py-16">
          
          {/* --- Top: Word Logo --- */}
          <View className="items-center mt-10">
            <Image 
              source={require('../assets/word-logo.png')}
              className="w-[150px] h-[40px]"
              resizeMode="contain"
            />
          </View>

          {/* --- Center: Radar Animation & Icon --- */}
          <View className="items-center justify-center">
            <View className="items-center justify-center w-[300px] h-[300px] relative mb-8">
              <RadarRing delay={0} />
              <RadarRing delay={1000} />
              <RadarRing delay={2000} />
              <Image 
                source={require('../assets/icon.png')}
                className="w-[100px] h-[100px]"
                resizeMode="contain"
              />
            </View>
            <Text className="text-gray-900 italic text-lg font-medium tracking-wide text-center">
              A quiet signal. A nearby heart.
            </Text>
          </View>

          {/* --- Bottom: Google Button --- */}
          <View className="w-full mb-5">
            <TouchableOpacity 
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
              className="flex-row items-center justify-center bg-white border border-[#FECACA] rounded-full py-4 mb-6 shadow-sm"
            >
              <Ionicons name="logo-google" size={20} color="#ed5d55" style={{ marginRight: 10 }} />
              <Text className="text-primary font-semibold text-lg">
                Continue with Google
              </Text>
            </TouchableOpacity>

            <Text className="text-center text-gray-600 px-4 leading-5">
              By continuing, you agree to share your location only while the app is in use.
            </Text>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}