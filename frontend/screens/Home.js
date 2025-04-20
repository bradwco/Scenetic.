// Home.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Inter_700Bold } from "@expo-google-fonts/inter";

function Home({ navigation }) {
  let [fontsLoaded] = useFonts({
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient colors={["#000000", "#A25B2D"]} style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.whiteText}>SCEN</Text>
        <Text style={styles.orangeText}>ETIC.</Text>
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    marginBottom: 40,
  },
  whiteText: {
    color: "white",
  },
  orangeText: {
    color: "#F28322",
  },
  button: {
    backgroundColor: "#2F2F2F",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
});
