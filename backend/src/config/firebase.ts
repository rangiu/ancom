import * as admin from 'firebase-admin';

let isFirebaseConnected = false;
let db: admin.firestore.Firestore | null = null;

// Memory Fallback Store
interface InMemoryStore {
  ateCount: number;
  notAteCount: number;
  votedTokens: Set<string>;
}

const memoryStore: InMemoryStore = {
  ateCount: 1248,
  notAteCount: 312,
  votedTokens: new Set<string>(),
};

try {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    db = admin.firestore();
    isFirebaseConnected = true;
    console.log('✅ Firebase Firestore connected successfully!');
  } else {
    console.log('ℹ️ Firebase environment variables missing. Using fallback in-memory database driver.');
  }
} catch (error) {
  console.warn('⚠️ Failed to initialize Firebase Admin SDK. Fallback memory engine enabled:', error);
}

export const getStats = async () => {
  if (isFirebaseConnected && db) {
    try {
      const docRef = db.collection('statistics').doc('global');
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        const initialData = { ateCount: 1248, notAteCount: 312, totalVotes: 1560 };
        await docRef.set(initialData);
        return {
          ...initialData,
          percentageAte: Number(((1248 / 1560) * 100).toFixed(1)),
          lastUpdated: new Date().toISOString(),
        };
      }

      const data = docSnap.data() || {};
      const ateCount = Number(data.ateCount || 0);
      const notAteCount = Number(data.notAteCount || 0);
      const totalVotes = ateCount + notAteCount;
      const percentageAte = totalVotes > 0 ? Number(((ateCount / totalVotes) * 100).toFixed(1)) : 0;

      return {
        ateCount,
        notAteCount,
        totalVotes,
        percentageAte,
        lastUpdated: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Error fetching Firestore stats, returning memory fallback:', err);
    }
  }

  // Fallback memory state
  const totalVotes = memoryStore.ateCount + memoryStore.notAteCount;
  const percentageAte = totalVotes > 0 ? Number(((memoryStore.ateCount / totalVotes) * 100).toFixed(1)) : 0;
  return {
    ateCount: memoryStore.ateCount,
    notAteCount: memoryStore.notAteCount,
    totalVotes,
    percentageAte,
    lastUpdated: new Date().toISOString(),
  };
};

export const recordVote = async (choice: 'ate' | 'not_yet', deviceToken: string) => {
  if (isFirebaseConnected && db) {
    const votesRef = db.collection('votes').doc(deviceToken);
    const voteSnap = await votesRef.get();

    if (voteSnap.exists) {
      throw new Error('SPAM_PREVENTED: Device has already submitted a vote.');
    }

    const docRef = db.collection('statistics').doc('global');
    await db.runTransaction(async (transaction: admin.firestore.Transaction) => {
      const statSnap = await transaction.get(docRef);
      const currentData = statSnap.data() || { ateCount: 0, notAteCount: 0 };

      const newAte = choice === 'ate' ? (currentData.ateCount || 0) + 1 : currentData.ateCount || 0;
      const newNotAte = choice === 'not_yet' ? (currentData.notAteCount || 0) + 1 : currentData.notAteCount || 0;

      transaction.set(votesRef, { choice, timestamp: admin.firestore.FieldValue.serverTimestamp() });
      transaction.set(docRef, { ateCount: newAte, notAteCount: newNotAte }, { merge: true });
    });

    return getStats();
  }

  // Memory store vote recording
  if (memoryStore.votedTokens.has(deviceToken)) {
    throw new Error('SPAM_PREVENTED: Device has already submitted a vote.');
  }

  memoryStore.votedTokens.add(deviceToken);
  if (choice === 'ate') {
    memoryStore.ateCount += 1;
  } else {
    memoryStore.notAteCount += 1;
  }

  return getStats();
};
