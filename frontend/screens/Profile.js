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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function Profile({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const storedData = await AsyncStorage.getItem("profileData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setFirstName(parsedData.firstName || "");
          setLastName(parsedData.lastName || "");
          setEmail(parsedData.email || "");
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

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      const updateData = {
        firstName,
        lastName,
        email,
        updatedAt: new Date().toISOString(),
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem("profileData", JSON.stringify(updateData));
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save profile changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Text style={styles.logo}>
          <Text style={styles.logoWhite}>SCEN</Text>
          <Text style={styles.logoOrange}>ETIC.</Text>
        </Text>
      </View>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.username}>
        {`${firstName} ${lastName}` || "Default User"}
      </Text>
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
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            try {
              await signOut(auth);
              Alert.alert("Signed Out", "You are signed out.");
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              console.error("Error signing out:", error);
              Alert.alert("Error", "Failed to sign out. Please try again.");
            }
          }}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginBottom: 30,
  },
  username: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 30,
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
    marginBottom: 40,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
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
