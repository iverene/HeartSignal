import axios from 'axios';

const API_URL = 'http://localhost:5000';

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
  }
};
