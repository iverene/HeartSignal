import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Switch, 
  ScrollView, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
  const navigation = useNavigation();
  
  // State for Visibility Toggle
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(previousState => !previousState);
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: () => console.log("User logged out") }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => console.log("Account deleted") }
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1">
        
        {/* Header */}
        <View className="flex-row items-center px-6 pt-2 mb-6">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-gray-900 text-2xl font-bold">Settings</Text>
        </View>

        <ScrollView className="flex-1 px-6">
          
          {/* User Information Card */}
          <View className="bg-white rounded-3xl p-6 mb-6 flex-row items-center shadow-sm border border-gray-100">
            <View className="w-16 h-16 bg-gray-50 rounded-full items-center justify-center mr-4 border-2 border-[#ED5D55]">
               <Ionicons name="person" size={32} color="#9CA3AF" />
            </View>
            <View>
              <Text className="text-xl font-bold text-gray-800">Username</Text>
              <Text className="text-gray-500 text-sm">heartsignal@example.com</Text>
            </View>
          </View>

          {/* Visibility Section */}
          <View className="bg-white rounded-3xl overflow-hidden mb-6 shadow-sm border border-gray-100">
            <View className="p-5 flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="eye-outline" size={22} color="#ED5D55" style={{ marginRight: 8 }} />
                  <Text className="text-lg font-semibold text-gray-800">Visible on Radar</Text>
                </View>
                <Text className="text-gray-500 text-xs leading-4">
                  When disabled, you won't appear to others nearby.
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#E5E7EB", true: "#ED5D55" }}
                thumbColor={isVisible ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#E5E7EB"
                onValueChange={toggleVisibility}
                value={isVisible}
              />
            </View>
          </View>

          {/* App Info Section */}
          <View className="bg-white rounded-3xl overflow-hidden mb-6 shadow-sm border border-gray-100">
            
            <TouchableOpacity className="p-5 flex-row items-center justify-between border-b border-gray-100 active:bg-gray-50">
              <View className="flex-row items-center">
                <Ionicons name="information-circle-outline" size={22} color="#4B5563" style={{ marginRight: 12 }} />
                <Text className="text-gray-700 font-medium text-base">About HeartSignal</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="p-5 flex-row items-center justify-between active:bg-gray-50">
              <View className="flex-row items-center">
                <Ionicons name="shield-checkmark-outline" size={22} color="#4B5563" style={{ marginRight: 12 }} />
                <Text className="text-gray-700 font-medium text-base">Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

          </View>

          {/* Account Actions */}
          <View className="mb-10">
            <TouchableOpacity 
              onPress={handleLogout}
              className="bg-gray-50 p-4 rounded-2xl mb-3 flex-row items-center justify-center border border-gray-200"
            >
              <Text className="text-[#ED5D55] font-bold text-base">Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleDeleteAccount}
              className="p-4 rounded-2xl flex-row items-center justify-center"
            >
              <Text className="text-gray-400 font-medium text-sm">Delete Account</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}