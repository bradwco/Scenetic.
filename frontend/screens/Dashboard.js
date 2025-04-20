import React, { useEffect, useState } from "react";
import BottomNavBar from "../components/BottomNavBar";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from "react-native";

export default function Dashboard({ navigation }) {
  const [sceneDescription, setSceneDescription] = useState("");
  const [selectedPresets, setSelectedPresets] = useState([]);
  const [presets, setPresets] = useState([]);
  const [loadingPresets, setLoadingPresets] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async (retryCount = 0) => {
    try {
      setLoadingPresets(true);
      const response = await fetch("http://10.14.4.251:5001/generate-tags");
      const data = await response.json();
      console.log("Received tags from backend:", data);

      const tags = Array.isArray(data.tags) ? data.tags : [];

      if (tags.length > 0) {
        const cleanedTags = tags
          .filter((tag) => typeof tag === "string")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0);

        if (cleanedTags.length > 0) {
          setPresets(cleanedTags);
          setLoadingPresets(false);
          return;
        }
      }

      if (retryCount < 3) {
        console.warn("Empty or invalid tags received. Retrying...");
        setTimeout(() => fetchTags(retryCount + 1), 500);
      } else {
        console.error("Max retries reached. Showing fallback.");
        setPresets([
          "Forest",
          "Rain",
          "Castle",
          "Sunset",
          "Beach",
          "Mountain",
          "City",
          "Desert",
        ]);
        setLoadingPresets(false);
      }
    } catch (error) {
      console.error("Failed to fetch tags:", error);
      if (retryCount < 3) {
        setTimeout(() => fetchTags(retryCount + 1), 500);
      } else {
        setPresets([
          "Forest",
          "Rain",
          "Castle",
          "Sunset",
          "Beach",
          "Mountain",
          "City",
          "Desert",
        ]);
        setLoadingPresets(false);
      }
    }
  };

  const handlePresetPress = (preset) => {
    const isAlreadySelected = selectedPresets.includes(preset);

    if (isAlreadySelected) {
      setSelectedPresets((prev) => prev.filter((p) => p !== preset));
      setSceneDescription((prev) => {
        const words = prev.split(" ").filter((word) => word !== preset);
        return words.join(" ");
      });
    } else {
      setSelectedPresets((prev) => [...prev, preset]);
      const space = sceneDescription.length > 0 ? " " : "";
      setSceneDescription((prev) => prev + space + preset);
    }
  };

  const handleBeginScan = async () => {
    // Only use scene description split into words
    const typedWords = sceneDescription
      .split(/\s+/)   // split on any whitespace
      .map(word => word.trim().toLowerCase()) // trim + lowercase
      .filter(word => word.length > 0); // remove empty strings
  
    const combinedTags = [...selectedPresets.map(tag => tag.toLowerCase()), ...typedWords];
  
    // Remove duplicates
    const uniqueTags = [...new Set(combinedTags)];
  
    alert("Scanning with tags: " + uniqueTags.join(", "));
  
    // 🔥 POST the tags to your backend (Pi) before navigating
    fetch('http://192.168.137.1:5000/set-tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tags: uniqueTags }),
    })
    .then(() => {
      navigation.navigate("Results", { selectedTags: uniqueTags });
    })
    .catch(error => {
      console.error("🔥 Error sending tags:", error);
    });
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.logo}>
            <Text style={styles.logoWhite}>SCEN</Text>
            <Text style={styles.logoOrange}>ETIC.</Text>
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.mainContent}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.innerContent}>
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

              {loadingPresets ? (
                <ActivityIndicator size="large" color="#F28322" />
              ) : (
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
                        onPress={() => handlePresetPress(preset)}
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
              )}

              <TouchableOpacity onPress={fetchTags}>
                <Text style={styles.viewMore}>View more</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.scanButton} onPress={handleBeginScan}>
                <Text style={styles.scanButtonText}>Begin Scan</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <BottomNavBar navigation={navigation} resetOnNavigate={true} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 90,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F28322",
  },
  logo: {
    fontSize: 16,
    fontWeight: "600",
    position: "absolute",
    top: 60,
    right: 30,
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
    paddingBottom: 130,
  },
  innerContent: {
    marginTop: 40,
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
    width: "45%",
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
    marginBottom: 20,
  },
  scanButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
