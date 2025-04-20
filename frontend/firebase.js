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
  query,
  where,
  getDocs,
  addDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  // If auth is already initialized, get the existing instance
  auth = getAuth(app);
}

// Initialize Firestore with offline persistence
const db = getFirestore(app);
const storage = getStorage(app);

// Export instances
export { auth, db, storage };

// AUTHENTICATION FUNCTIONS
export const signupUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);
    await signOut(auth);
    return {
      success: true,
      message: "Verification email sent. Please verify before logging in.",
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    if (!user.emailVerified) {
      await signOut(auth);
      return {
        success: false,
        message: "Please verify your email before logging in.",
      };
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

// PROFILE FUNCTIONS
export const updateUserProfile = async (user, data) => {
  try {
    const updates = {};

    // Update email if changed
    if (data.email && data.email !== user.email) {
      await updateEmail(user, data.email);
      updates.email = data.email;
    }

    // Update password if provided
    if (data.password && data.password.length >= 6) {
      await updatePassword(user, data.password);
    }

    // Prepare profile data
    const profileData = {
      firstName: data.firstName,
      lastName: data.lastName,
      profileImageUrl: data.profileImageUrl,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Update profile data in Firestore
    const userRef = doc(db, "users", user.uid);
    console.log("Updating profile with data:", profileData);
    await setDoc(userRef, profileData, { merge: true });

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: error.message };
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Retrieved profile data:", data);
      return { success: true, data };
    }
    // If no profile exists, create one with default values
    const defaultData = {
      firstName: "",
      lastName: "",
      profileImageUrl: null,
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, defaultData);
    return { success: true, data: defaultData };
  } catch (error) {
    console.error("Error getting profile:", error);
    return { success: false, message: error.message };
  }
};
