const admin = require('firebase-admin');
const db = admin.firestore();
const { sendPushNotification } = require('../utils/pushNotifications');

const sendSignal = async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    // 1. Validation
    if (!fromUserId || !toUserId) {
      return res.status(400).json({ error: 'Missing sender or recipient ID' });
    }
    
    // 2. Create the new signal with Server Timestamp
    const signalRef = db.collection('signals').doc();
    await signalRef.set({
      fromUserId,
      toUserId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'sent'
    });

    // 3. Check for Mutual Match (Optimized)
    const matchSnapshot = await db.collection('signals')
      .where('fromUserId', '==', toUserId)
      .where('toUserId', '==', fromUserId)
      .limit(1) 
      .get();

    const isMatch = !matchSnapshot.empty;

    // 4. Get tokens and Send Notifications (Parallel)
    const [toUserDoc, fromUserDoc] = await Promise.all([
      db.collection('users').doc(toUserId).get(),
      db.collection('users').doc(fromUserId).get()
    ]);
    
    const toToken = toUserDoc.data()?.fcmToken;
    const fromToken = fromUserDoc.data()?.fcmToken;

    const notifications = [];

    if (isMatch) {
      // --- MUTUAL MATCH ---
      console.log(`Match found between ${fromUserId} and ${toUserId}`);
      
      if(toToken) {
        notifications.push(sendPushNotification(toToken, "It's a Match! 💘 Someone you signaled liked you back!"));
      }
      if(fromToken) {
        notifications.push(sendPushNotification(fromToken, "It's a Match! 💘 You matched with a user!"));
      }
    } else {
      // --- STANDARD SIGNAL ---
      if(toToken) {
        notifications.push(sendPushNotification(toToken, "💗 Someone sent you a Heart Signal!"));
      }
    }

    // Execute all notification promises instantly
    await Promise.all(notifications);

    res.status(200).json({ message: 'Signal sent', isMatch });

  } catch (err) {
    console.error("Signal Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const getReceivedSignals = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Order by newest first
    const snapshot = await db.collection('signals')
      .where('toUserId', '==', userId)
      .orderBy('timestamp', 'desc') 
      .get();
      
    const signals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null
    }));
    
    res.status(200).json({ signals });
  } catch (err) {
    console.error("Get Signals Error:", err);
    // Return empty array to keep app stable
    res.status(200).json({ signals: [] });
  }
};

module.exports = { sendSignal, getReceivedSignals };