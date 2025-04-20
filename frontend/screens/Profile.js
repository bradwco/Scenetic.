import React, { useState, useEffect } from "react";
import BottomNavBar from "../components/BottomNavBar";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  logoutUser,
  auth,
  db,
  updateUserProfile,
  getUserProfile,
} from "../firebase";
import { doc, setDoc, updateEmail, updatePassword, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile({ navigation }) {
  const [profileImage, setProfileImage] = useState(
    require("../assets/user.png")
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load profile data when component mounts
  useEffect(() => {
    const loadProfileData = async () => {
      if (!auth.currentUser) return;
      
      try {
        setIsLoading(true);
        // Try to load from AsyncStorage first
        const storedData = await AsyncStorage.getItem('profileData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setFirstName(parsedData.firstName || "");
          setLastName(parsedData.lastName || "");
          setEmail(parsedData.email || auth.currentUser.email || "");
          if (parsedData.profileImageUrl) {
            setProfileImage({ uri: parsedData.profileImageUrl });
          }
        }

        // Then load from Firebase
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Loaded profile data:", data);
          
          // Update state with loaded data
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setEmail(data.email || auth.currentUser.email || "");
          
          // Handle profile image
          if (data.profileImageUrl) {
            setProfileImage({ uri: data.profileImageUrl });
          }

          // Store in AsyncStorage
          await AsyncStorage.setItem('profileData', JSON.stringify(data));
        } else {
          // Create initial profile if it doesn't exist
          const initialData = {
            firstName: "",
            lastName: "",
            email: auth.currentUser.email,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userRef, initialData);
          await AsyncStorage.setItem('profileData', JSON.stringify(initialData));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        Alert.alert("Error", "Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfileData();
  }, []);

  // Save to AsyncStorage whenever fields change
  useEffect(() => {
    const saveToLocalStorage = async () => {
      const data = {
        firstName,
        lastName,
        email,
        profileImageUrl: typeof profileImage === 'object' && profileImage.uri ? profileImage.uri : null
      };
      await AsyncStorage.setItem('profileData', JSON.stringify(data));
    };
    
    saveToLocalStorage();
  }, [firstName, lastName, email, profileImage]);

  const handleProfileImagePress = async () => {
    Alert.alert("Change Profile Picture", "Choose an option", [
      {
        text: "Take Photo",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
          if (!result.canceled) setProfileImage({ uri: result.assets[0].uri });
        },
      },
      {
        text: "Choose from Library",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });
          if (!result.canceled) setProfileImage({ uri: result.assets[0].uri });
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSaveChanges = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "You must be logged in to save changes");
      return;
    }

    try {
      setIsLoading(true);
      const userRef = doc(db, "users", auth.currentUser.uid);
      
      // Prepare the update data
      const updateData = {
        firstName,
        lastName,
        email: email || auth.currentUser.email,
        updatedAt: new Date().toISOString(),
      };

      // Handle profile image
      if (typeof profileImage === 'object' && profileImage.uri) {
        updateData.profileImageUrl = profileImage.uri;
      }

      console.log("Saving profile data:", updateData);

      // Update Firestore document
      await setDoc(userRef, updateData, { merge: true });
      console.log("Profile updated in Firestore");

      // Update email if changed
      if (updateData.email && updateData.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, updateData.email);
        console.log("Email updated successfully");
      }

      // Update password if provided and valid
      if (password && password.length >= 6) {
        await updatePassword(auth.currentUser, password);
        console.log("Password updated successfully");
        setPassword("");
      }

      // Verify the update
      const updatedDoc = await getDoc(userRef);
      if (updatedDoc.exists()) {
        const updatedData = updatedDoc.data();
        console.log("Verified updated data:", updatedData);
        // Update AsyncStorage with the verified data
        await AsyncStorage.setItem('profileData', JSON.stringify(updatedData));
        Alert.alert("Success", "Profile updated successfully");
      } else {
        throw new Error("Failed to verify profile update");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Update the username display to show the actual user's name
  const displayName = `${firstName} ${lastName}`.trim() || "Default User";

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoWrapper}>
        <Text style={styles.logo}>
          <Text style={styles.logoWhite}>SCEN</Text>
          <Text style={styles.logoOrange}>ETIC.</Text>
        </Text>
      </View>

      <Text style={styles.title}>Profile</Text>

      <TouchableOpacity onPress={handleProfileImagePress}>
        <Image source={profileImage} style={styles.avatar} />
      </TouchableOpacity>
      <Text style={styles.username}>{displayName}</Text>

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.formContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>Name</Text>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Email</Text>
          <Text style={styles.inputLabel}>Your Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="example@gmail.com"
            placeholderTextColor="#989c99"
          />

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Password</Text>
          <Text style={styles.inputLabel}>Change Password</Text>
          <View style={styles.passwordInputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="********"
              placeholderTextColor="#989c99"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIconWrapper}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Image
                source={require("../assets/eye.png")}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveChanges}
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={async () => {
              await logoutUser();
              Alert.alert("Logged out");
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            }}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Bottom nav bar */}
      <BottomNavBar navigation={navigation} resetOnNavigate={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logoWrapper: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1,
  },
  logo: {
    fontSize: 16,
    fontWeight: "600",
  },
  logoWhite: {
    color: "white",
  },
  logoOrange: {
    color: "#F28322",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F28322",
    marginTop: 40,
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 12,
  },
  username: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    padding: 20,
    flexGrow: 1,
    paddingBottom: 60,
  },

  sectionLabel: {
    color: "white",
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
    fontSize: 16,
  },
  inputLabel: {
    color: "#ccc",
    marginTop: 10,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#121212",
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#F28322",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#F28322",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 25,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1f1f1f",
    paddingVertical: 2,
    borderRadius: 30,
    marginHorizontal: 4,
    marginBottom: 30,
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
  navButton: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  passwordInputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  eyeIconWrapper: {
    position: "absolute",
    right: 12,
    top: "30%",
    transform: [{ translateY: -12 }],
    padding: 4,
  },
  eyeIcon: {
    width: 24,
    height: 24,
    tintColor: "#999",
  },
  divider: {
    height: 1,
    backgroundColor: "#444",
    marginVertical: 20,
    opacity: 0.6,
  },
});
