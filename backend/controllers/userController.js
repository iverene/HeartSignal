const admin = require('firebase-admin');
const db = admin.firestore();
const { getDistance } = require('../utils/distance');

const updateLocation = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    // Basic validation
    if (!userId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await db.collection('users').doc(userId).set({
      latitude,
      longitude,
      updatedAt: new Date(),
      isVisible: true // Ensure user is marked as visible
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

    // SETTINGS: Search Radius in Kilometers
    const SEARCH_RADIUS_KM = 5; 

    usersSnapshot.forEach(doc => {
      const data = doc.data();

      // Ensure the user has valid location data
      if (data.latitude && data.longitude) {
        const distance = getDistance(latitude, longitude, data.latitude, data.longitude);

        // Filter by Radius
        if (distance <= SEARCH_RADIUS_KM) {
          nearbyUsers.push({ 
            userId: doc.id, 
            avatarId: data.avatarId || 1, 
            distance: distance.toFixed(1) + 'km',
            // CRITICAL FIX: Sending coordinates so frontend can map them
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

module.exports = { updateLocation, getNearbyUsers };