import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "trendpulse-ai-8fc15",
  appId: "1:28815536054:web:b98bc2a530ff34d13e1b17",
  storageBucket: "trendpulse-ai-8fc15.firebasestorage.app",
  apiKey: "AIzaSyCzVpxzKnqvmBAN9M4PwskadB6BQQykkxM",
  authDomain: "trendpulse-ai-8fc15.firebaseapp.com",
  messagingSenderId: "28815536054",
  measurementId: "G-CN4TNS9209"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const USER_DOC_ID = 'desmond_nkefua_leads';

// Sync Saved Opportunity IDs to Firestore
export const syncSavedOpportunitiesToFirebase = async (savedIds) => {
  try {
    const docRef = doc(db, 'users', USER_DOC_ID);
    await setDoc(docRef, { savedIds }, { merge: true });
    console.log('Saved opportunities successfully synchronized with Firebase.');
  } catch (error) {
    console.warn('Firebase Firestore is offline or disconnected. Falling back to local storage:', error);
  }
};

// Load Saved Opportunity IDs from Firestore
export const fetchSavedOpportunitiesFromFirebase = async () => {
  try {
    const docRef = doc(db, 'users', USER_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().savedIds || [];
    }
  } catch (error) {
    console.warn('Error reading saved opportunities from Firebase, falling back to local storage:', error);
  }
  return null;
};

// Sync Custom Scraped Opportunities to Firestore
export const syncCustomOpportunitiesToFirebase = async (customOpps) => {
  try {
    const docRef = doc(db, 'data', 'custom_leads');
    await setDoc(docRef, { list: customOpps }, { merge: true });
    console.log('Custom scraped opportunities successfully synchronized with Firebase.');
  } catch (error) {
    console.warn('Firebase Firestore is offline. Falling back to local storage:', error);
  }
};

// Load Custom Scraped Opportunities from Firestore
export const fetchCustomOpportunitiesFromFirebase = async () => {
  try {
    const docRef = doc(db, 'data', 'custom_leads');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().list || [];
    }
  } catch (error) {
    console.warn('Error reading custom opportunities from Firebase, falling back to local storage:', error);
  }
  return null;
};
