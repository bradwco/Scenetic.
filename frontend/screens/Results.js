import React, { useState } from "react"; // <-- Add useState
import BottomNavBar from "../components/BottomNavBar";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";

export default function Results({ navigation }) {
  const MJPEG_URL = "http://192.168.137.1:5000/video_feed";

  const scanningProgress = 0.75;
  const monitor = 2;
  const confidence = 91;
  const tags = ["Forest", "Fog", "Ruins"];

  const [buttonDisabled, setButtonDisabled] = useState(false); // <-- Add state

  const triggerSequence = () => {
    if (buttonDisabled) return; // just in case

    setButtonDisabled(true); // Disable immediately

    fetch('http://192.168.137.1:5000/start-sequence', {
      method: 'POST',
    })
    .then(response => console.log('Arduino sequence triggered!'))
    .catch(error => console.error('Error triggering Arduino:', error));

    // Re-enable button after 20 seconds
    setTimeout(() => {
      setButtonDisabled(false);
    }, 20000); // 20,000 ms = 20 sec
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <Text style={styles.logo}>
          <Text style={styles.logoWhite}>SCEN</Text>
          <Text style={styles.logoOrange}>ETIC.</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Live View</Text>
          <View style={styles.liveCircle} />
        </View>

        <View style={styles.videoWrapper}>
          <WebView
            source={{ uri: MJPEG_URL }}
            style={styles.video}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
          />
        </View>

        {/* 🔥 Temp Button */}
        <TouchableOpacity
          style={[styles.tempButton, buttonDisabled && styles.tempButtonDisabled]}
          onPress={triggerSequence}
          disabled={buttonDisabled}
        >
          <Text style={styles.tempButtonText}>
            {buttonDisabled ? "Cooldown..." : "Run Arduino Sequence"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.scanText}>Scanning...</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${scanningProgress * 100}%` }]} />
        </View>

        <View style={styles.matchBox}>
          <Text style={styles.matchTitle}>Best Match</Text>
          <Text style={styles.matchText}>
            Monitor: <Text style={styles.highlight}>{monitor}</Text>
          </Text>
          <Text style={styles.matchText}>
            Confidence: <Text style={styles.highlight}>{confidence}%</Text>
          </Text>
          <Text style={styles.matchText}>
            Tags:{" "}
            {tags.map((tag) => (
              <Text key={tag} style={styles.highlight}>
                [{tag}]{" "}
              </Text>
            ))}
          </Text>
          <Text style={styles.matchText}>
            You should shoot your movie scene on scene{" "}
            <Text style={styles.highlight}>{monitor}</Text>!
          </Text>
        </View>
      </ScrollView>

      <BottomNavBar navigation={navigation} resetOnNavigate={true} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  content: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F28322",
    marginRight: 10,
  },
  liveCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "red",
  },
  videoWrapper: {
    aspectRatio: 16 / 9,
    width: "100%",
    backgroundColor: "#000",
    marginBottom: 48,
    borderRadius: 10,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },

  /* 🔥 ADD this for the temporary button */
  tempButton: {
    backgroundColor: "#F28322",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
    marginTop: -30,
  },
  tempButtonDisabled: {
    backgroundColor: "#888", // <-- gray when disabled
  },
  tempButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },  

  scanText: {
    color: "white",
    fontSize: 14,
    marginBottom: 6,
  },
  progressBarBackground: {
    width: "100%",
    height: 24,
    borderRadius: 20,
    backgroundColor: "#ccc",
    overflow: "hidden",
    marginBottom: 40,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#00FF00",
    borderRadius: 20,
  },
  matchBox: {
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    padding: 20,
  },
  matchTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  matchText: {
    color: "white",
    fontSize: 14,
    marginBottom: 6,
  },
  highlight: {
    color: "#F28322",
    fontWeight: "600",
  },
});
