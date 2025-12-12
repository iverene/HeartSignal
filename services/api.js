import axios from 'axios';

// --- CONFIGURATION ---
// 1. FOR LOCAL TESTING: Use your computer's IP address (e.g., 192.168.1.5)
// 2. FOR PRODUCTION: Use your deployed backend URL (e.g., https://my-app.onrender.com)
const API_URL = 'http://192.168.1.13:5000'; // <--- CHANGE THIS IP ADDRESS

// --- API CALLS ---

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

export const getNearbyUsers = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `${API_URL}/users/nearby?latitude=${latitude}&longitude=${longitude}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby users:', error);
    return { nearbyUsers: [] };
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