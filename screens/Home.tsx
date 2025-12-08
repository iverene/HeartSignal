import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Dimensions, 
  StyleSheet, 
  Alert,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';

// --- Mock Data for Nearby Users ---
const NEARBY_USERS = [
  { id: 1, x: -80, y: -90, distance: "50m" },
  { id: 2, x: 90, y: -40, distance: "120m" },
  { id: 3, x: -50, y: 110, distance: "200m" },
  { id: 4, x: 80, y: 80, distance: "15m" },
  { id: 5, x: 120, y: -120, distance: "300m" },
];

// --- 1. Radar Ring Component ---
const RadarRing = ({ delay }: { delay: number }) => {
  const ringProgress = useSharedValue(0);

  useEffect(() => {
    ringProgress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.out(Easing.ease) }),
        -1, 
        false
      )
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(ringProgress.value, [0, 0.7, 1], [0.6, 0.2, 0]),
      transform: [{ scale: interpolate(ringProgress.value, [0, 1], [1, 3.5]) }],
    };
  });

  return (
    <Animated.View 
      className="absolute w-[100px] h-[100px] rounded-full border border-white bg-white/20"
      style={ringStyle}
    />
  );
};

// --- 2. User Dot Component ---
const UserDot = ({ user, onPress, isSignalsMode }: { user: any, onPress: (u: any) => void, isSignalsMode: boolean }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(isSignalsMode ? 0 : 1);

  useEffect(() => {
    // Only animate opacity when mode changes
    opacity.value = withTiming(isSignalsMode ? 0 : 1, { duration: 500 });
  }, [isSignalsMode]);

  useEffect(() => {
    // Continuous floating animation
    translateY.value = withRepeat(
      withTiming(user.id % 2 === 0 ? 5 : -5, { duration: 2000 + (user.id * 100), easing: Easing.inOut(Easing.ease) }),
      -1, 
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }]
  }));

  return (
    <Animated.View 
      style={[
        { position: 'absolute', left: '50%', top: '50%', marginLeft: user.x, marginTop: user.y },
        animatedStyle
      ]}
      pointerEvents={isSignalsMode ? 'none' : 'auto'}
    >
      <TouchableOpacity 
        onPress={() => onPress(user)}
        activeOpacity={0.7}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} 
        className="items-center justify-center"
      >
        <View className="w-5 h-5 rounded-full bg-white shadow-lg shadow-black/30 border-2 border-[#ED5D55]" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- 3. Signal Mode Component ---
const SignalMode = ({ viewMode }: { viewMode: 'signals' | 'nearby' }) => {
  const opacity = useSharedValue(viewMode === 'signals' ? 1 : 0);
  const translateY = useSharedValue(viewMode === 'signals' ? 0 : 50);

  useEffect(() => {
    const targetOpacity = viewMode === 'signals' ? 1 : 0;
    const targetY = viewMode === 'signals' ? 0 : 50;
    opacity.value = withTiming(targetOpacity, { duration: 500 });
    translateY.value = withTiming(targetY, { duration: 500 });
  }, [viewMode]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View 
      style={[animatedStyle]}
      className="absolute bottom-[15%] items-center"
      pointerEvents={viewMode === 'signals' ? 'auto' : 'none'} 
    >
      <Text className="text-white/80 text-lg font-medium mb-1 tracking-widest uppercase">
        Signals Received
      </Text>
      <Text className="text-white text-6xl font-bold shadow-sm">
        12
      </Text>
    </Animated.View>
  );
};

// --- 4. Nearby Mode Component ---
const NearbyMode = ({ viewMode, handleUserClick }: { viewMode: 'signals' | 'nearby', handleUserClick: (u: any) => void }) => {
  const opacity = useSharedValue(viewMode === 'nearby' ? 1 : 0);

  useEffect(() => {
    const targetOpacity = viewMode === 'nearby' ? 1 : 0;
    opacity.value = withTiming(targetOpacity, { duration: 500 });
  }, [viewMode]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[animatedStyle]} 
      className="absolute w-full h-full"
      pointerEvents={viewMode === 'nearby' ? 'auto' : 'none'}
    >
      {NEARBY_USERS.map((user) => (
        <UserDot key={user.id} user={user} onPress={handleUserClick} isSignalsMode={viewMode === 'signals'} />
      ))}
      
      <View className="absolute bottom-[10%] w-full items-center">
         <Text className="text-white/80 text-sm bg-black/10 px-4 py-2 rounded-full overflow-hidden">
            {NEARBY_USERS.length} active hearts nearby
         </Text>
      </View>
    </Animated.View>
  );
};

// --- 5. Modal Component (DEFINED OUTSIDE HOME) ---
const SendSignalModal = ({ visible, onClose, onSend, targetUser }: { visible: boolean, onClose: () => void, onSend: () => void, targetUser: any }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <TouchableWithoutFeedback>
            <View className="bg-[#FDFBF7] w-full max-w-sm rounded-3xl p-6 items-center shadow-xl shadow-black/20">
              
              <View className="bg-[#FFECEF] p-4 rounded-full mb-4">
                <Ionicons name="heart" size={32} color="#FF5C8D" />
              </View>

              <Text className="text-xl font-bold text-[#36454F] mb-2 text-center">
                Send a Signal?
              </Text>
              <Text className="text-gray-500 text-center mb-8 px-2 leading-6">
                You are about to send a quiet heart signal to <Text className="font-bold text-[#FF5C8D]">{targetUser?.name || 'this person'}</Text>. They will only know it's you if they signal back.
              </Text>

              <View className="flex-row w-full space-x-3">
                <TouchableOpacity 
                  onPress={onClose}
                  className="flex-1 bg-gray-200 py-4 rounded-xl items-center"
                >
                  <Text className="text-gray-600 font-bold text-base">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={onSend}
                  className="flex-1 bg-[#FF5C8D] py-4 rounded-xl items-center shadow-md shadow-[#FF5C8D]/30"
                >
                  <Text className="text-white font-bold text-base">Send Signal</Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// --- 6. MAIN SCREEN EXPORT ---
export default function Home() {
  const [viewMode, setViewMode] = useState<'signals' | 'nearby'>('signals');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Pulse Animation Values
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
        withDelay(1000, withTiming(1, { duration: 0 }))
      ),
      -1,
      false
    );
  }, []);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
  };

  const confirmSendSignal = () => {
    console.log("Sending signal to user ID:", selectedUser?.id);
    setSelectedUser(null);
    Alert.alert("Sent", "Your signal is on its way.");
  };

  const handleSettings = () => {
    Alert.alert("Settings", "Settings menu would open here.");
  };

  return (
    <View className="flex-1">
      {/* Full Screen Gradient */}
      <LinearGradient
        colors={['#ED5D55', '#F8A5A5']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView className="flex-1">
        
        {/* Header Row */}
        <View className="flex-row justify-between items-center px-6 pt-4 mb-4 z-50">
          
          {/* Top Left: Mode Switch */}
          <View className="flex-row bg-black/10 rounded-full p-1 h-12 items-center">
            <TouchableOpacity 
              onPress={() => setViewMode('signals')}
              className={`h-10 w-12 items-center justify-center rounded-full ${viewMode === 'signals' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
            >
              <Ionicons name="heart" size={20} color={viewMode === 'signals' ? '#ED5D55' : 'white'} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setViewMode('nearby')}
              className={`h-10 w-12 items-center justify-center rounded-full ${viewMode === 'nearby' ? 'bg-white shadow-sm' : 'bg-transparent'}`}
            >
              <Ionicons name="people" size={22} color={viewMode === 'nearby' ? '#ED5D55' : 'white'} />
            </TouchableOpacity>
          </View>

          {/* Top Right: Settings Button */}
          <TouchableOpacity 
            onPress={handleSettings}
            className="w-12 h-12 bg-white/20 rounded-full items-center justify-center border border-white/30"
          >
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Main Content Area */}
        <View className="flex-1 justify-center items-center relative">

          {/* The Radar & Logo */}
          <View className="absolute items-center justify-center w-full h-full pointer-events-none">
            {/* Animated Rings */}
            <View className="items-center justify-center w-[300px] h-[300px] absolute">
              <RadarRing delay={0} />
              <RadarRing delay={1000} />
              <RadarRing delay={2000} />
            </View>

            {/* Pulsing Logo */}
            <Animated.View style={[pulseAnimatedStyle, { zIndex: 10 }]}>
               <Image 
                // STRICTLY USING THE PATH YOU REQUESTED
                source={require('../assets/icon.png')}
                className="w-[120px] h-[120px] shadow-lg shadow-black/20"
                resizeMode="contain"
                style={{ tintColor: 'white' }} 
              />
            </Animated.View>
          </View>

          {/* Mode 1: Signals Display */}
          <SignalMode viewMode={viewMode} />

          {/* Mode 2: Nearby Users Display */}
          <NearbyMode viewMode={viewMode} handleUserClick={handleUserClick} />

        </View>
      </SafeAreaView>

      {/* Confirmation Modal */}
      <SendSignalModal 
        visible={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onSend={confirmSendSignal}
        targetUser={selectedUser}
      />
    </View>
  );
}