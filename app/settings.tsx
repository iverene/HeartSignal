import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // <--- UPDATED

export default function Settings() {
  const router = useRouter(); // <--- UPDATED
  const [isVisible, setIsVisible] = useState(true);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        <View className="flex-row items-center px-6 pt-2 mb-6">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-gray-900 text-2xl font-bold">Settings</Text>
        </View>

        <ScrollView className="flex-1 px-6">
          {/* Replaced shadow-sm with inline style */}
          <View className="bg-white rounded-3xl p-6 mb-6 flex-row items-center border border-gray-100" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}>
            <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mr-4 border-2 border-[#ED5D55]">
               <Ionicons name="person" size={32} color="#9CA3AF" />
            </View>
            <View>
              <Text className="text-xl font-bold text-gray-800">Username</Text>
              <Text className="text-gray-500 text-sm">heartsignal@example.com</Text>
            </View>
          </View>

          <View className="bg-white rounded-3xl overflow-hidden mb-6 border border-gray-100" style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }}>
            <View className="p-5 flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-lg font-semibold text-gray-800">Visible on Radar</Text>
                <Text className="text-gray-500 text-xs leading-4">When disabled, you won't appear to others nearby.</Text>
              </View>
              <Switch trackColor={{ false: "#E5E7EB", true: "#ED5D55" }} value={isVisible} onValueChange={setIsVisible} />
            </View>
          </View>
          
          <View className="mb-10">
             <TouchableOpacity onPress={() => Alert.alert("Logout")} className="bg-gray-50 p-4 rounded-2xl mb-3 items-center border border-gray-200"><Text className="text-[#ED5D55] font-bold">Log Out</Text></TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}