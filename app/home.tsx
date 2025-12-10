import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, TouchableOpacity, StyleSheet, Alert, Modal, TouchableWithoutFeedback 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // <--- UPDATED
import Animated, { 
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, withDelay, Easing, interpolate,
} from 'react-native-reanimated';

const NEARBY_USERS = [
  { id: 1, x: -80, y: -90 }, { id: 2, x: 90, y: -40 },
  { id: 3, x: -50, y: 110 }, { id: 4, x: 80, y: 80 }, { id: 5, x: 120, y: -120 },
];

const RadarRing = ({ delay }: { delay: number }) => {
  const ringProgress = useSharedValue(0);
  useEffect(() => {
    ringProgress.value = withDelay(delay, withRepeat(withTiming(1, { duration: 3000, easing: Easing.out(Easing.ease) }), -1, false));
  }, []);
  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ringProgress.value, [0, 0.7, 1], [0.6, 0.2, 0]),
    transform: [{ scale: interpolate(ringProgress.value, [0, 1], [1, 3.5]) }],
  }));
  return <Animated.View className="absolute w-[100px] h-[100px] rounded-full border border-white" style={[ringStyle, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />;
};

const UserDot = ({ user, onPress, isSignalsMode }: { user: any, onPress: (u: any) => void, isSignalsMode: boolean }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(isSignalsMode ? 0 : 1);
  useEffect(() => { opacity.value = withTiming(isSignalsMode ? 0 : 1, { duration: 500 }); }, [isSignalsMode]);
  useEffect(() => { translateY.value = withRepeat(withTiming(user.id % 2 === 0 ? 5 : -5, { duration: 2000 + (user.id * 100), easing: Easing.inOut(Easing.ease) }), -1, true); }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value, transform: [{ translateY: translateY.value }] }));

  return (
    <Animated.View style={[{ position: 'absolute', left: '50%', top: '50%', marginLeft: user.x, marginTop: user.y }, animatedStyle]} pointerEvents={isSignalsMode ? 'none' : 'auto'}>
      <TouchableOpacity onPress={() => onPress(user)} activeOpacity={0.7} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} className="items-center justify-center">
        {/* Removed shadow-lg from className, added inline style */}
        <View className="w-5 h-5 rounded-full bg-white border-2 border-[#ED5D55]" style={{ shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const SendSignalModal = ({ visible, onClose, onSend, targetUser }: any) => {
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function Home() {
  const router = useRouter(); 
  const [viewMode, setViewMode] = useState<'signals' | 'nearby'>('signals');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const handleSettings = () => router.push('/settings'); // <--- UPDATED

  return (
    <View className="flex-1">
      <LinearGradient colors={['#ED5D55', '#F8A5A5']} style={StyleSheet.absoluteFill} />
      <SafeAreaView className="flex-1">
        <View className="flex-row justify-between items-center px-6 pt-4 mb-4 z-50">
          <View className="flex-row rounded-full p-1 h-12 items-center" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
            <TouchableOpacity onPress={() => setViewMode('signals')} className={`h-10 w-12 items-center justify-center rounded-full ${viewMode === 'signals' ? 'bg-white' : 'bg-transparent'}`}>
              <Ionicons name="heart" size={20} color={viewMode === 'signals' ? '#ED5D55' : 'white'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewMode('nearby')} className={`h-10 w-12 items-center justify-center rounded-full ${viewMode === 'nearby' ? 'bg-white' : 'bg-transparent'}`}>
              <Ionicons name="people" size={22} color={viewMode === 'nearby' ? '#ED5D55' : 'white'} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleSettings} className="w-12 h-12 rounded-full items-center justify-center border border-white/30" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Ionicons name="settings-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center items-center relative">
          <View className="absolute items-center justify-center w-full h-full pointer-events-none">
             <View className="items-center justify-center w-[300px] h-[300px] absolute">
               <RadarRing delay={0} /><RadarRing delay={1000} /><RadarRing delay={2000} />
             </View>
             <Image source={require('../assets/icon.png')} className="w-[120px] h-[120px]" resizeMode="contain" style={{ tintColor: 'white', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 }} />
          </View>
          
          {viewMode === 'nearby' && (
            <View className="absolute w-full h-full">
               {NEARBY_USERS.map((user) => <UserDot key={user.id} user={user} onPress={setSelectedUser} isSignalsMode={false} />)}
            </View>
          )}
        </View>
      </SafeAreaView>
      <SendSignalModal visible={!!selectedUser} onClose={() => setSelectedUser(null)} onSend={() => { setSelectedUser(null); Alert.alert("Sent!"); }} targetUser={selectedUser} />
    </View>
  );
}