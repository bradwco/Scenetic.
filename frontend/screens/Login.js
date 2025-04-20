import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from "react-native";
import { signupUser, loginUser } from '../firebase';
import * as Keychain from 'react-native-keychain';

export default function Login({ navigation }) {
  const [activeTab, setActiveTab] = useState("Register");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isRegister = activeTab === "Register";

  return (
    <SafeAreaView style={styles.container} importantForAutofill="yes">
      <View style={styles.logoContainer} importantForAutofill="yes">
        <Text style={styles.logoText}>
          <Text style={styles.logoWhite}>SCEN</Text>
          <Text style={styles.logoOrange}>ETIC.</Text>
        </Text>
      </View>

      <View style={styles.topText} importantForAutofill="yes">
        <Text style={styles.title}>
          {isRegister
            ? "Go ahead and set up your account"
            : "Welcome back, log in to your account"}
        </Text>
        <Text style={styles.subtitle}>
          Sign in-up to enjoy the best user experience
        </Text>
      </View>

      <View style={styles.card} importantForAutofill="yes">
        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabButton, isRegister && styles.activeTabButton]}
            onPress={() => setActiveTab("Register")}
          >
            <Text style={[styles.tabText, isRegister && styles.activeTabText]}>
              Register
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, !isRegister && styles.activeTabButton]}
            onPress={() => setActiveTab("Login")}
          >
            <Text style={[styles.tabText, !isRegister && styles.activeTabText]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Email Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.labelText}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            importantForAutofill="yes"
            autoComplete="email"
            textContentType="emailAddress"
            value={email}
            onChangeText={setEmail}
            inputmode='email'
          />
        </View>

        {/* Password Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.labelText}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, borderWidth: 0 }]}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              autoCorrect={false}
              importantForAutofill="yes"
              autoComplete="password"
              textContentType="password"
              value={password}
              onChangeText={setPassword}
              inputmode='password'
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Image
                source={require("../assets/eye.png")}
                style={styles.eyeIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={async () => {
            if (email == "" || password == "") {
              alert("Please fill in all fields");
              return;
            }

            if (isRegister) {
              const result = await signupUser(email, password);
              if (result.success) {
                alert(result.message);
                setActiveTab("Login");
              } else {
                alert(result.message);
              }
            } else {
              const result = await loginUser(email, password);
              console.log(result);

              if (result.success) {
                Alert.alert("Login Successful");
                navigation.navigate("Dashboard", { 
                  user: {
                    uid: result.user.uid,
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                  }
                });
                await Keychain.setGenericPassword(email, password);
              } else {
                alert('Login Failed', result.message);
              }
            }
          }}
        >
          <Text style={styles.primaryButtonText}>
            {isRegister ? "Register" : "Login"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>
            {isRegister ? "Or register with" : "Or login with"}
          </Text>
          <View style={styles.divider} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../assets/google.png")}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../assets/github.png")}
              style={styles.socialIcon}
              resizeMode="contain"
            />
            <Text style={styles.socialText}>Github</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  logoContainer: {
    alignItems: "flex-end",
    padding: 20,
  },
  logoText: {
    fontSize: 14,
    fontWeight: "700",
  },
  logoWhite: {
    color: "white",
  },
  logoOrange: {
    color: "#F28322",
  },
  topText: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    justifyContent: "space-evenly",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#F1F1F1",
    borderRadius: 30,
    padding: 4,
    alignSelf: "center",
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: "#fff",
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#888",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
  input: {
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: "#F9F9F9",
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#F9F9F9",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  primaryButton: {
    backgroundColor: "#D5894B",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 8,
    color: "#999",
    fontSize: 12,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 5,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  socialText: {
    fontSize: 14,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    marginLeft: 4,
  },
});
