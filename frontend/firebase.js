import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  initializeAuth,
  getReactNativePersistence,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyByoJpbU30Cl9_W-GpOOh6Kd8I4Nv2uo7A",
  authDomain: "scenetic-349f5.firebaseapp.com",
  projectId: "scenetic-349f5",
  storageBucket: "scenetic-349f5.firebasestorage.app",
  messagingSenderId: "250139473389",
  appId: "1:250139473389:web:e62bb1bb793502038c63e4",
  measurementId: "G-TYSFCPYXGD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app); // fallback
}

// Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Export instances
export { auth, db, storage };

//
// 🔥 AUTHENTICATION FUNCTIONS
//

export const signupUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    await signOut(auth);
    return { success: true, message: "Verification email sent. Please verify before logging in." };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (!user.emailVerified) {
      await signOut(auth);
      return { success: false, message: "Please verify your email before logging in." };
    }
    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const monitorAuthState = (callback) => {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

//
// 🔥 UPLOAD SNAPSHOT FUNCTION (new)
//

export const uploadSnapshot = async (localImagePath, itemName, confidence, userTags) => {
  try {
    // Fetch local image
    const response = await fetch(localImagePath);
    const blob = await response.blob();

    // Upload to Firebase Storage
    const filename = `matches/${Date.now()}_${itemName}.jpg`;
    const storageRef = ref(storage, filename);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    // Save info to Firestore
    await addDoc(collection(db, "Match"), {
      imageURL: downloadURL,
      itemName: itemName,
      confidence: confidence,
      userTags: userTags,
      createdAt: serverTimestamp(),
    });

    console.log("✅ Snapshot uploaded successfully!");
    return { success: true };
  } catch (error) {
    console.error("🔥 Upload Snapshot Error:", error);
    return { success: false, message: error.message };
  }
};

export const fetchMatches = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Match"));
    const matches = [];

    querySnapshot.forEach((doc) => {
      matches.push({ id: doc.id, ...doc.data() });
    });

    console.log("✅ Retrieved matches:", matches);
    return { success: true, matches };
  } catch (error) {
    console.error("🔥 Error fetching matches:", error);
    return { success: false, message: error.message };
  }
};