import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Redirect } from "expo-router"; // <--- Import Redirect
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Radar Ring Component ---
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
      transform: [{ scale: interpolate(ringProgress.value, [0, 1], [1, 3]) }],
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
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <--- New State for Redirect

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userProfile = await AsyncStorage.getItem("userProfile");

        // Small delay to prevent flicker
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (userProfile) {
          setIsLoggedIn(true); // <--- Set state instead of navigating immediately
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Use Declarative Redirect to avoid "No Navigation Context" error
  if (isLoggedIn) {
    return <Redirect href="/home" />;
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#FDFBF7]">
        <ActivityIndicator size="large" color="#FF5C8D" />
      </View>
    );
  }

  const handleGoogleSignIn = () => {
    router.push("/profile-setup");
  };

  return (
    <View className="flex-1 bg-ghostWhite relative overflow-hidden">
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-8 justify-between py-16">
          <View className="items-center mt-10">
            <Image
              source={require("../assets/word-logo.png")}
              className="w-[150px] h-[40px]"
              resizeMode="contain"
            />
          </View>

          <View className="items-center justify-center">
            <View className="items-center justify-center w-[300px] h-[300px] relative mb-8">
              <RadarRing delay={0} />
              <RadarRing delay={1000} />
              <RadarRing delay={2000} />
              <Image
                source={require("../assets/icon.png")}
                className="w-[100px] h-[100px]"
                resizeMode="contain"
              />
            </View>

            <Text className="text-gray-900 italic text-lg font-medium tracking-wide text-center">
              A quiet signal. A nearby heart.
            </Text>
          </View>

          <View className="w-full mb-5">
            <TouchableOpacity
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
              className="flex-row items-center justify-center bg-white border border-[#FECACA] rounded-full py-4 mb-6 shadow-sm"
            >
              <Image
                source={require("../assets/logo-google.png")}
                style={{ width: 20, height: 20, marginRight: 10 }}
                resizeMode="contain"
              />
              <Text className="text-primary font-semibold text-lg">
                Continue with Google
              </Text>
            </TouchableOpacity>

            <Text className="text-center text-gray-600 px-4 leading-5">
              By continuing, you agree to share your location only while the app
              is in use.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
