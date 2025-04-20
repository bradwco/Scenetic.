import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
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
            { width: `${scanningProgress * 100}%`, backgroundColor: "#00FF00" },
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

      {/* Bottom nav bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Image
            source={require("../assets/home.png")}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Results")}>
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
    paddingTop: 60,
    paddingHorizontal: 20,
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
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
    marginTop: 20,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  scanText: {
    color: "white",
    fontSize: 14,
    marginTop: 20,
    marginBottom: 6,
  },
  progressBarBackground: {
    width: "100%",
    height: 24,
    borderRadius: 20,
    backgroundColor: "#ccc",
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 20,
  },
  matchBox: {
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
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
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1f1f1f",
    paddingVertical: 14,
    borderRadius: 30,
    marginHorizontal: 4,
    marginBottom: 18,
  },
  navIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
  },
});
