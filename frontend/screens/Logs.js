import React, { useState } from "react";
import BottomNavBar from "../components/BottomNavBar";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

export default function Logs({ navigation }) {
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: "Apr 19, 2025 • 3:42 PM",
      monitor: 2,
      confidence: 91,
      tags: ["Forest", "Fog", "Ruins"],
    },
    {
      id: 2,
      timestamp: "Apr 19, 2025 • 3:37 PM",
      monitor: 3,
      confidence: 78,
      tags: ["Beach", "Sun", "Sand"],
    },
  ]);

  const deleteLog = (id) => {
    setLogs((prevLogs) => prevLogs.filter((log) => log.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoWrapper}>
        <Text style={styles.logo}>
          <Text style={styles.logoWhite}>SCEN</Text>
          <Text style={styles.logoOrange}>ETIC.</Text>
        </Text>
      </View>

      {/* Title */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Past Matches</Text>
      </View>

      {/* Scrollable Logs */}
      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        {logs.map((log) => (
          <View key={log.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.timestamp}>{log.timestamp}</Text>
              <TouchableOpacity
                style={styles.trashWrapper}
                onPress={() => deleteLog(log.id)}
              >
                <Image
                  source={require("../assets/trash.png")}
                  style={styles.trashIcon}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>
              Matched:{" "}
              <Text style={styles.highlight}>Monitor {log.monitor}</Text>
            </Text>
            <Text style={styles.cardText}>
              Confidence:{" "}
              <Text style={styles.highlight}>{log.confidence}%</Text>
            </Text>
            <Text style={styles.cardText}>
              Tags:{" "}
              {log.tags.map((tag, index) => (
                <Text key={index} style={styles.highlight}>
                  [{tag}]{" "}
                </Text>
              ))}
            </Text>
          </View>
        ))}
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
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F28322",
  },
  scrollArea: {
    flex: 1,
    marginBottom: 90,
  },
  card: {
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  timestamp: {
    color: "#ccc",
    fontSize: 13,
  },
  cardText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
  },
  highlight: {
    color: "#F28322",
    fontWeight: "600",
  },
  trashWrapper: {
    padding: 8,
    borderRadius: 20,
  },
  trashIcon: {
    width: 20,
    height: 20,
    tintColor: "red",
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
