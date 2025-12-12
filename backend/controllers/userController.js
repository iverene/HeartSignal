const admin = require('firebase-admin');
const db = admin.firestore();
const { getDistance } = require('../utils/distance');

const updateLocation = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    if (!userId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await db.collection('users').doc(userId).set({
      latitude,
      longitude,
      updatedAt: new Date(),
      isVisible: true
    }, { merge: true });

    res.status(200).json({ message: 'Location updated' });
  } catch (err) {
    console.error("Update Location Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const getNearbyUsers = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const usersSnapshot = await db.collection('users').get();
    const nearbyUsers = [];
    const SEARCH_RADIUS_KM = 5; 

    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.latitude && data.longitude) {
        const distance = getDistance(latitude, longitude, data.latitude, data.longitude);
        if (distance <= SEARCH_RADIUS_KM) {
          nearbyUsers.push({ 
            userId: doc.id, 
            avatarId: data.avatarId || 1, 
            distance: distance.toFixed(1) + 'km',
            latitude: data.latitude,
            longitude: data.longitude
          });
        }
      }
    });

    res.status(200).json({ nearbyUsers });
  } catch (err) {
    console.error("Get Nearby Users Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// --- NEW FUNCTION ADDED HERE ---
const updateFcmToken = async (req, res) => {
  try {
    const { userId, fcmToken } = req.body;
    
    if (!userId || !fcmToken) {
      return res.status(400).json({ error: 'Missing userId or token' });
    }

    await db.collection('users').doc(userId).set({ 
      fcmToken,
      updatedAt: new Date()
    }, { merge: true });

    res.status(200).json({ message: 'Token updated' });
  } catch (err) {
    console.error("Update Token Error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { updateLocation, getNearbyUsers, updateFcmToken };