import React, { useState } from "react";
import BottomNavBar from "../components/BottomNavBar";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";

const presets = [
  "Foggy",
  "Forest",
  "Ruins",
  "Night",
  "Desert",
  "Beach",
  "Snow",
  "Romantic",
  "River",
  "Action",
  "Neon",
  "Canyon",
];

export default function Dashboard({ navigation }) {
  const [sceneDescription, setSceneDescription] = useState("");
  const [selectedPresets, setSelectedPresets] = useState([]);
  const state = navigation.getState();
  const currentRoute = state.routes[state.index].name;

  const addToDescription = (word) => {
    const space = sceneDescription.length > 0 ? " " : "";
    setSceneDescription((prev) => prev + space + word);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Logo top-right */}
        <View style={styles.logoWrapper}>
          <Text style={styles.logo}>
            <Text style={styles.logoWhite}>SCEN</Text>
            <Text style={styles.logoOrange}>ETIC.</Text>
          </Text>
        </View>

        {/* Main content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.mainContent}
        >
          <View style={styles.headerRow}>
            <Text style={styles.title}>Dashboard</Text>
          </View>

          <Text style={styles.subheading}>Match to your movie scene!</Text>

          <TextInput
            style={styles.textArea}
            placeholder="Describe your scene..."
            placeholderTextColor="#999"
            value={sceneDescription}
            onChangeText={setSceneDescription}
            multiline
            numberOfLines={5}
          />

          <Text style={styles.smallText}>or choose preset keywords...</Text>

          <Text style={styles.presetsLabel}>Presets</Text>

          <View style={styles.grid}>
            {presets.map((preset, index) => {
              const isSelected = selectedPresets.includes(preset);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.presetButton,
                    isSelected ? styles.orangeButton : styles.whiteButton,
                  ]}
                  onPress={() => {
                    const isAlreadySelected = selectedPresets.includes(preset);

                    if (isAlreadySelected) {
                      setSelectedPresets((prev) =>
                        prev.filter((p) => p !== preset)
                      );
                      setSceneDescription((prev) => {
                        const words = prev
                          .split(" ")
                          .filter((word) => word !== preset);
                        return words.join(" ");
                      });
                    } else {
                      setSelectedPresets((prev) => [...prev, preset]);
                      const space = sceneDescription.length > 0 ? " " : "";
                      setSceneDescription((prev) => prev + space + preset);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.presetText,
                      isSelected ? styles.whiteText : styles.orangeText,
                    ]}
                  >
                    {preset}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity onPress={() => console.log("View more clicked")}>
            <Text style={styles.viewMore}>View more</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => {
              alert("Started scan...");
              navigation.navigate("Results");
            }}
          >
            <Text style={styles.scanButtonText}>Begin Scan</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>

        {/* Bottom nav bar */}
        <BottomNavBar navigation={navigation} resetOnNavigate={true} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "space-between",
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
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 120,
    paddingBottom: 150,
    justifyContent: "flex-start",
  },
  headerRow: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F28322",
    marginTop: -12,
    marginBottom: 25,
  },
  subheading: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    fontSize: 14,
    color: "#333",
    height: 120,
    textAlignVertical: "top",
    marginBottom: 12,
  },
  smallText: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 16,
  },
  presetsLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  presetButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    width: "30%",
    alignItems: "center",
    height: 42,
  },
  orangeButton: {
    backgroundColor: "#F28322",
  },
  whiteButton: {
    backgroundColor: "#fff",
  },
  presetText: {
    fontSize: 14,
    fontWeight: "500",
  },
  orangeText: {
    color: "#F28322",
  },
  whiteText: {
    color: "#fff",
  },
  viewMore: {
    color: "#fff",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 24,
    textAlign: "right",
  },
  scanButton: {
    backgroundColor: "#D5894B",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
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
});
