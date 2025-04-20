import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";

const presets = [
  "Foggy",
  "Forest",
  "Ruins",
  "Urban",
  "Night",
  "Beach",
  "Desert",
  "Romantic",
  "Snow",
  "Abandoned",
];

export default function Dashboard({ navigation }) {
  const [sceneDescription, setSceneDescription] = useState("");

  const addToDescription = (word) => {
    const space = sceneDescription.length > 0 ? " " : "";
    setSceneDescription((prev) => prev + space + word);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Describe Your Scene</Text>

      {/* White paragraph input */}
      <TextInput
        style={styles.textArea}
        placeholder="Describe your scene..."
        placeholderTextColor="#999"
        value={sceneDescription}
        onChangeText={setSceneDescription}
        multiline
        numberOfLines={5}
      />

      {/* Preset keywords section */}
      <View style={styles.presetsContainer}>
        <Text style={styles.sectionLabel}>Presets</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {presets.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={styles.presetButton}
              onPress={() => addToDescription(preset)}
            >
              <Text style={styles.presetText}>{preset}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={() => console.log("View more clicked")}>
          <Text style={styles.viewMore}>View more</Text>
        </TouchableOpacity>
      </View>

      {/* Begin scan button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => console.log("Begin scan clicked")}
      >
        <Text style={styles.scanButtonText}>Begin Scan</Text>
      </TouchableOpacity>

      {/* Bottom nav bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image
            source={require("../assets/home.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Image
            source={require("../assets/camera.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Logs")}>
          <Image
            source={require("../assets/logs.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    color: "#333",
    height: 120,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  presetsContainer: {
    marginBottom: 32,
  },
  sectionLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  presetButton: {
    backgroundColor: "#F28322",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  presetText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  viewMore: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 8,
  },
  scanButton: {
    backgroundColor: "#D5894B",
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  scanButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1f1f1f",
    paddingVertical: 12,
    borderRadius: 20,
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
});
