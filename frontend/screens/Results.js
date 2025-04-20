import React, { useState } from "react";
import BottomNavBar from "../components/BottomNavBar";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";

export default function Results({ navigation }) {
  const [isLive, setIsLive] = useState(true);
  const scanningProgress = 0.75;
  const monitor = 2;
  const confidence = 91;
  const tags = ["Forest", "Fog", "Ruins"];

  return (
    <View style={styles.container}>
      {/* Logo top-right */}
      <View style={styles.logoWrapper}>
        <Text style={styles.logo}>
          <Text style={styles.logoWhite}>SCEN</Text>
          <Text style={styles.logoOrange}>ETIC.</Text>
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title row */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Live View</Text>
          <View
            style={[
              styles.liveCircle,
              { backgroundColor: isLive ? "red" : "white" },
            ]}
          />
        </View>

        {/* Live video */}
        <View style={styles.videoWrapper}>
          <Video
            source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={styles.video}
          />
        </View>

        {/* Scanning Progress */}
        <Text style={styles.scanText}>Scanning...</Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${scanningProgress * 100}%`,
                backgroundColor: "#00FF00",
              },
            ]}
          />
        </View>

        {/* Best Match Box */}
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
  content: {
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
  },
  videoWrapper: {
    aspectRatio: 16 / 9,
    width: "100%",
    backgroundColor: "#000",
    marginBottom: 48,
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
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
