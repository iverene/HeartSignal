import axios from 'axios';

// IMPORTANT: For physical devices, replace 'localhost' with your computer's local IP address
// e.g., 'http://192.168.1.5:5000'
const API_URL = 'http://192.168.1.13:5000'; 

// Function to update user location
export const updateLocation = async (userId, latitude, longitude) => {
  try {
    const response = await axios.post(`${API_URL}/users/location`, {
      userId,
      latitude,
      longitude,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating location:', error);
  }
};

// Function to get nearby users
export const getNearbyUsers = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/nearby?latitude=${latitude}&longitude=${longitude}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby users:', error);
    return { nearbyUsers: [] }; // Return empty array on error to prevent crashes
  }
};

export const updateFcmToken = async (userId, token) => {
  try {
    const response = await axios.post(`${API_URL}/users/fcm-token`, {
      userId,
      fcmToken: token,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating FCM token:', error);
  }
};

// --- NEW FUNCTION ADDED ---
export const sendSignal = async (fromUserId, toUserId) => {
  try {
    const response = await axios.post(`${API_URL}/signals/send`, {
      fromUserId,
      toUserId,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending signal:', error);
    throw error;
  }
};