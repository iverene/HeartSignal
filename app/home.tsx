import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device'; // Ensure you have installed: npx expo install expo-device
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Animated, {
  Easing, interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat, withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import API services
import { getNearbyUsers, sendSignal, updateLocation } from '../services/api';

// --- ANIMATION COMPONENTS ---

// --- Radar Component ---
const RadarRing = ({ delay }: { delay: number }) => {
  const ringProgress = useSharedValue(0);
  
  React.useEffect(() => {
    ringProgress.value = withDelay(
      delay, 
      withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.out(Easing.ease) }), 
        -1, 
        false
      )
    );
  }, []);
  
  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ringProgress.value, [0, 0.7, 1], [0.6, 0.2, 0]),
    transform: [{ scale: interpolate(ringProgress.value, [0, 1], [1, 3.5]) }],
  }));

  return (
    <Animated.View 
      style={[
        {
          position: 'absolute',
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 1,
          borderColor: 'white',
          backgroundColor: 'rgba(255,255,255,0.2)',
        },
        ringStyle
      ]} 
    />
  );
};

// --- User Dot Component ---
const UserDot = ({ user, onPress, isSignalsMode }: { user: any, onPress: (u: any) => void, isSignalsMode: boolean }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(isSignalsMode ? 0 : 1);
  
  useEffect(() => { opacity.value = withTiming(isSignalsMode ? 0 : 1, { duration: 500 }); }, [isSignalsMode]);
  
  // Simple "floating" animation to make dots look alive
  useEffect(() => { 
    const duration = 2000 + (Math.random() * 1000);
    translateY.value = withRepeat(withTiming(5, { duration, easing: Easing.inOut(Easing.ease) }), -1, true); 
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.View 
      style={[{ position: 'absolute', left: '50%', top: '50%', marginLeft: user.x, marginTop: user.y }, animatedStyle]} 
      pointerEvents={isSignalsMode ? 'none' : 'auto'}
    >
      <TouchableOpacity onPress={() => onPress(user)} activeOpacity={0.7} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} className="items-center justify-center">
        {/* User Dot Visual */}
        <View className="w-5 h-5 rounded-full bg-white border-2 border-[#ED5D55]" style={{ shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const SendSignalModal = ({ visible, onClose, onSend }: any) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <TouchableWithoutFeedback>
            <View className="bg-[#FDFBF7] w-full max-w-sm rounded-3xl p-6 items-center" style={{ shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 }}>
              <View className="bg-[#FFECEF] p-4 rounded-full mb-4"><Ionicons name="heart" size={32} color="#FF5C8D" /></View>
              <Text className="text-xl font-bold text-[#36454F] mb-2 text-center">Send a Signal?</Text>
              <Text className="text-gray-500 text-center mb-8 px-2 leading-6">You are about to send a quiet heart signal.</Text>
              <View className="flex-row w-full space-x-3">
                <TouchableOpacity onPress={onClose} className="flex-1 bg-gray-200 py-4 rounded-xl items-center"><Text className="text-gray-600 font-bold text-base">Cancel</Text></TouchableOpacity>
                <TouchableOpacity onPress={onSend} className="flex-1 bg-[#FF5C8D] py-4 rounded-xl items-center" style={{ shadowColor: '#FF5C8D', shadowOpacity: 0.3, shadowRadius: 5, elevation: 3 }}><Text className="text-white font-bold text-base">Send Signal</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

export default function Home() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'signals' | 'nearby'>('signals');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [signalCount, setSignalCount] = useState(0);

  // Define vertical shift amount (in pixels) to move the center UP
  const CENTER_OFFSET_Y = -60;

  useFocusEffect(
    useCallback(() => {
      const initializeHome = async () => {
        try {
          const storedVisibility = await AsyncStorage.getItem('userVisibility');
          let shouldBeVisible = true; 
          if (storedVisibility !== null) {
            shouldBeVisible = JSON.parse(storedVisibility);
          }

          if (shouldBeVisible) {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Required', 'Location access is needed to show you on the radar. Visibility has been turned off.', [{ text: 'OK' }]);
              shouldBeVisible = false;
              await AsyncStorage.setItem('userVisibility', JSON.stringify(false));
            }
          }
          setIsVisible(shouldBeVisible);
        } catch (e) {
          console.error("Failed to initialize home", e);
        }
      };
      initializeHome();
    }, [])
  );

  const scale = useSharedValue(1);
  React.useEffect(() => {
    scale.value = withRepeat(withSequence(withTiming(1.05, { duration: 400 }), withTiming(1, { duration: 400 }), withDelay(1000, withTiming(1, { duration: 0 }))), -1, false);
  }, []);
  
  // Real data state
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);
  
  // --- AUTOMATIC ID ASSIGNMENT FOR TESTING ---
  let currentUserId = "emulator_user"; // Default fallback
  
  if (Platform.OS === 'web') {
    currentUserId = "web_user"; // Laptop Browser will be this user
  } else if (Device.isDevice) {
    currentUserId = "real_phone_user"; // Physical Phone will be this user
  }

  const handleSettings = () => router.push('/settings');

  // --- LOCATION & DATA SYNC LOOP ---
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const startLocationTracking = async () => {
      // 1. Request Permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Permission to access location was denied. The radar will not work.');
        return;
      }

      // 2. Initial Fetch
      await fetchAndSyncLocation();

      // 3. Poll every 10 seconds to update location and get neighbors
      intervalId = setInterval(fetchAndSyncLocation, 10000);
    };

    startLocationTracking();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const fetchAndSyncLocation = async () => {
    try {
      // A. Get Current Location
      const loc = await Location.getCurrentPositionAsync({});
      
      // B. Send my location to Backend
      // This creates the user in the DB if they don't exist yet
      console.log(`[${currentUserId}] Updating location:`, loc.coords.latitude, loc.coords.longitude);
      await updateLocation(currentUserId, loc.coords.latitude, loc.coords.longitude);

      // C. Get Nearby Users from Backend
      const data = await getNearbyUsers(loc.coords.latitude, loc.coords.longitude);
      
      if (data && data.nearbyUsers) {
        // Filter out myself so I don't see my own dot
        const others = data.nearbyUsers.filter((u: any) => u.userId !== currentUserId);

        console.log(`[${currentUserId}] Found neighbors:`, others.length);

        // Map lat/lon to screen X/Y coordinates relative to center
        // Scale factor: determines how far apart dots appear. 
        // Higher number = dots appear further away for the same real distance.
        const scalingFactor = 400000; 

        const mapped = others.map((u: any) => {
          const latDiff = u.latitude - loc.coords.latitude;
          const lonDiff = u.longitude - loc.coords.longitude;

          return {
            ...u,
            id: u.userId,
            // Invert Y because screen Y coordinates go down, but Latitude goes up (North)
            y: -latDiff * scalingFactor, 
            x: lonDiff * scalingFactor 
          };
        });

        setNearbyUsers(mapped);
      }
    } catch (error) {
      console.log("Error syncing location:", error);
    }
  };

  const handleSendSignal = async () => {
    if (!selectedUser) return;
    
    try {
      console.log(`Sending signal from ${currentUserId} to ${selectedUser.userId}`);
      await sendSignal(currentUserId, selectedUser.userId);
      
      // On Web, Alert.alert doesn't work the same, so we use confirm or console
      if (Platform.OS === 'web') {
        window.alert("Signal Sent! Your quiet signal is on its way.");
      } else {
        Alert.alert("Signal Sent!", "Your quiet signal is on its way.");
      }
      
      setSelectedUser(null);
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert("Error: Could not send signal.");
      } else {
        Alert.alert("Error", "Could not send signal. Please try again.");
      }
    }
  };

  return (
    <View className="flex-1">
      <LinearGradient colors={['#ED5D55', '#F8A5A5']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView className="flex-1">
        
        {/* Header Controls */}
        <View className="flex-row justify-between items-center px-6 pt-4 mb-4 z-50">
          {isVisible ? (
            <View className="flex-row rounded-full p-1 h-12 items-center" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
              <TouchableOpacity onPress={() => setViewMode('signals')} className={`h-10 w-12 items-center justify-center rounded-full ${viewMode === 'signals' ? 'bg-white' : 'bg-transparent'}`}>
                <Ionicons name="heart" size={20} color={viewMode === 'signals' ? '#ED5D55' : 'white'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setViewMode('nearby')} className={`h-10 w-12 items-center justify-center rounded-full ${viewMode === 'nearby' ? 'bg-white' : 'bg-transparent'}`}>
                <Ionicons name="people" size={22} color={viewMode === 'nearby' ? '#ED5D55' : 'white'} />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="h-12" /> 
          )}

          <TouchableOpacity onPress={() => router.push('/settings')} className="w-12 h-12 rounded-full items-center justify-center border border-white/30" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View className="flex-1 justify-center items-center relative">
          
          {isVisible ? (
            <>
              {/* Radar Layer - Shifted Up */}
              <View 
                className="absolute items-center justify-center w-full h-full pointer-events-none"
                style={{ marginTop: CENTER_OFFSET_Y }}
              >
                <View className="items-center justify-center w-[300px] h-[300px]">
                  <RadarRing delay={0} />
                  <RadarRing delay={1000} />
                  <RadarRing delay={2000} />
                  <Animated.View style={[pulseAnimatedStyle, { zIndex: 10 }]}>
                    <Image 
                      source={require('../assets/icon.png')} 
                      className="w-[120px] h-[120px]" 
                      resizeMode="contain" 
                      style={{ tintColor: 'white', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 }} 
                    />
                  </Animated.View>
                </View>
              </View>
              
              {/* Signal Count (Bottom) - Kept at absolute bottom, NOT shifted, to balance layout */}
              {viewMode === 'signals' && (
                <View className="absolute bottom-[15%] items-center">
                  <Text className="text-white text-6xl font-bold shadow-sm">
                    {signalCount}
                  </Text>
                </View>
              )}

              {/* Nearby Users Layer - Shifted Up to Match Radar */}
              {viewMode === 'nearby' && (
                <View 
                  className="absolute w-full h-full"
                  style={{ marginTop: CENTER_OFFSET_Y }}
                >
                  {NEARBY_USERS.map((user) => <UserDot key={user.id} user={user} onPress={setSelectedUser} isSignalsMode={false} />)}
                  
                </View>
              )}
              
              {/* Counter Pill (Fixed at bottom independently of Radar shift) */}
              {viewMode === 'nearby' && (
                 <View className="absolute bottom-[10%] w-full items-center pointer-events-none">
                    <Text className="text-white/80 text-sm bg-black/10 px-4 py-2 rounded-full overflow-hidden">
                       {NEARBY_USERS.length} active hearts nearby
                    </Text>
                 </View>
              )}
            </>
          ) : (
            // Hidden State - Shifted Up
            <View 
              className="items-center justify-center opacity-80"
              style={{ marginTop: CENTER_OFFSET_Y }}
            >
               <View className="w-[120px] h-[120px] rounded-full border-4 border-white/30 items-center justify-center mb-6 bg-white/10">
                  <Ionicons name="eye-off-outline" size={50} color="white" />
               </View>
               <Text className="text-white text-2xl font-bold mb-2">Signal Hidden</Text>
               <Text className="text-white/80 text-center px-10 leading-6">
                 Your radar is off. You are not visible to others and cannot see nearby signals.
               </Text>
               <TouchableOpacity 
                 onPress={() => router.push('/settings')}
                 className="mt-8 bg-white px-6 py-3 rounded-full"
               >
                 <Text className="text-[#ED5D55] font-bold">Enable in Settings</Text>
               </TouchableOpacity>
            </View>
          )}

        </View>
      </SafeAreaView>
      
      {isVisible && (
        <SendSignalModal 
          visible={!!selectedUser} 
          onClose={() => setSelectedUser(null)} 
          onSend={() => { 
            setSelectedUser(null); 
            Alert.alert("Signal Sent!", "Your heart signal has been sent.");
          }} 
          targetUser={selectedUser} 
        />
      )}
    </View>
  );
}